const { query } = require('../config/database');
const { getCache, setCache } = require('../config/redis');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  // Try to get from cache
  const cacheKey = 'dashboard:stats';
  const cached = await getCache(cacheKey);
  
  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached), cached: true });
  }
  
  const stats = {};
  
  // Total users
  const usersResult = await query('SELECT COUNT(*) as count FROM users');
  stats.totalUsers = parseInt(usersResult.rows[0].count);
  
  // New users this month
  const newUsersResult = await query(`
    SELECT COUNT(*) as count FROM users 
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `);
  stats.newUsersThisMonth = parseInt(newUsersResult.rows[0].count);
  
  // Total orders
  const ordersResult = await query('SELECT COUNT(*) as count FROM orders');
  stats.totalOrders = parseInt(ordersResult.rows[0].count);
  
  // Orders this month
  const ordersThisMonthResult = await query(`
    SELECT COUNT(*) as count FROM orders 
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `);
  stats.ordersThisMonth = parseInt(ordersThisMonthResult.rows[0].count);
  
  // Total revenue
  const revenueResult = await query(`
    SELECT COALESCE(SUM(total), 0) as total FROM orders 
    WHERE status IN ('completed', 'processing')
  `);
  stats.totalRevenue = parseFloat(revenueResult.rows[0].total);
  
  // Revenue this month
  const revenueThisMonthResult = await query(`
    SELECT COALESCE(SUM(total), 0) as total FROM orders 
    WHERE status IN ('completed', 'processing')
    AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `);
  stats.revenueThisMonth = parseFloat(revenueThisMonthResult.rows[0].total);
  
  // Pending orders
  const pendingOrdersResult = await query(`
    SELECT COUNT(*) as count FROM orders WHERE status = 'pending'
  `);
  stats.pendingOrders = parseInt(pendingOrdersResult.rows[0].count);
  
  // Open tickets
  const openTicketsResult = await query(`
    SELECT COUNT(*) as count FROM tickets WHERE status IN ('open', 'in_progress')
  `);
  stats.openTickets = parseInt(openTicketsResult.rows[0].count);
  
  // Total products
  const productsResult = await query('SELECT COUNT(*) as count FROM products WHERE status = $1', ['active']);
  stats.totalProducts = parseInt(productsResult.rows[0].count);
  
  // Low stock products
  const lowStockResult = await query(`
    SELECT COUNT(*) as count FROM products 
    WHERE stock_quantity <= 10 AND stock_quantity > 0 AND status = 'active'
  `);
  stats.lowStockProducts = parseInt(lowStockResult.rows[0].count);
  
  // Out of stock products
  const outOfStockResult = await query(`
    SELECT COUNT(*) as count FROM products 
    WHERE stock_quantity = 0 AND status = 'active'
  `);
  stats.outOfStockProducts = parseInt(outOfStockResult.rows[0].count);
  
  // Total blog posts
  const blogPostsResult = await query(`
    SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'
  `);
  stats.totalBlogPosts = parseInt(blogPostsResult.rows[0].count);
  
  // Total portfolio projects
  const portfolioResult = await query(`
    SELECT COUNT(*) as count FROM portfolio WHERE is_active = true
  `);
  stats.totalPortfolioProjects = parseInt(portfolioResult.rows[0].count);
  
  // Cache for 5 minutes
  await setCache(cacheKey, JSON.stringify(stats), 300);
  
  res.json({ success: true, data: stats, cached: false });
};

/**
 * Get sales statistics
 */
exports.getSalesStats = async (req, res) => {
  const { period = '30days' } = req.query;
  
  let dateFilter = "created_at >= CURRENT_DATE - INTERVAL '30 days'";
  
  if (period === '7days') {
    dateFilter = "created_at >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (period === '90days') {
    dateFilter = "created_at >= CURRENT_DATE - INTERVAL '90 days'";
  } else if (period === 'year') {
    dateFilter = "created_at >= CURRENT_DATE - INTERVAL '1 year'";
  }
  
  // Sales by day
  const salesByDayResult = await query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as order_count,
      COALESCE(SUM(total), 0) as revenue
    FROM orders
    WHERE ${dateFilter} AND status IN ('completed', 'processing')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);
  
  // Sales by status
  const salesByStatusResult = await query(`
    SELECT 
      status,
      COUNT(*) as count,
      COALESCE(SUM(total), 0) as revenue
    FROM orders
    WHERE ${dateFilter}
    GROUP BY status
  `);
  
  // Top selling products
  const topProductsResult = await query(`
    SELECT 
      p.id, p.name, p.image,
      COUNT(oi.id) as order_count,
      SUM(oi.quantity) as total_quantity,
      SUM(oi.price * oi.quantity) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.${dateFilter} AND o.status IN ('completed', 'processing')
    GROUP BY p.id, p.name, p.image
    ORDER BY revenue DESC
    LIMIT 10
  `);
  
  res.json({
    success: true,
    data: {
      salesByDay: salesByDayResult.rows,
      salesByStatus: salesByStatusResult.rows,
      topProducts: topProductsResult.rows
    }
  });
};

/**
 * Get user statistics
 */
exports.getUserStats = async (req, res) => {
  // Users by role
  const usersByRoleResult = await query(`
    SELECT role, COUNT(*) as count
    FROM users
    GROUP BY role
  `);
  
  // User registrations by month (last 12 months)
  const registrationsByMonthResult = await query(`
    SELECT 
      TO_CHAR(created_at, 'YYYY-MM') as month,
      COUNT(*) as count
    FROM users
    WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month ASC
  `);
  
  // Active users (logged in last 30 days)
  const activeUsersResult = await query(`
    SELECT COUNT(*) as count FROM users
    WHERE last_login >= CURRENT_DATE - INTERVAL '30 days'
  `);
  
  // Top customers by revenue
  const topCustomersResult = await query(`
    SELECT 
      u.id, u.first_name, u.last_name, u.email, u.avatar,
      COUNT(o.id) as order_count,
      COALESCE(SUM(o.total), 0) as total_spent
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE o.status IN ('completed', 'processing')
    GROUP BY u.id, u.first_name, u.last_name, u.email, u.avatar
    ORDER BY total_spent DESC
    LIMIT 10
  `);
  
  res.json({
    success: true,
    data: {
      usersByRole: usersByRoleResult.rows,
      registrationsByMonth: registrationsByMonthResult.rows,
      activeUsers: parseInt(activeUsersResult.rows[0].count),
      topCustomers: topCustomersResult.rows
    }
  });
};

/**
 * Get product statistics
 */
exports.getProductStats = async (req, res) => {
  // Products by category
  const productsByCategoryResult = await query(`
    SELECT category, COUNT(*) as count
    FROM products
    WHERE status = 'active'
    GROUP BY category
  `);
  
  // Stock status
  const stockStatusResult = await query(`
    SELECT 
      CASE 
        WHEN stock_quantity = 0 THEN 'out_of_stock'
        WHEN stock_quantity <= 10 THEN 'low_stock'
        ELSE 'in_stock'
      END as status,
      COUNT(*) as count
    FROM products
    WHERE status = 'active'
    GROUP BY 
      CASE 
        WHEN stock_quantity = 0 THEN 'out_of_stock'
        WHEN stock_quantity <= 10 THEN 'low_stock'
        ELSE 'in_stock'
      END
  `);
  
  // Average product price by category
  const avgPriceByCategoryResult = await query(`
    SELECT 
      category,
      ROUND(AVG(price)::numeric, 2) as avg_price,
      COUNT(*) as product_count
    FROM products
    WHERE status = 'active'
    GROUP BY category
  `);
  
  res.json({
    success: true,
    data: {
      productsByCategory: productsByCategoryResult.rows,
      stockStatus: stockStatusResult.rows,
      avgPriceByCategory: avgPriceByCategoryResult.rows
    }
  });
};

/**
 * Get content statistics
 */
exports.getContentStats = async (req, res) => {
  // Blog posts by status
  const blogByStatusResult = await query(`
    SELECT status, COUNT(*) as count
    FROM blog_posts
    GROUP BY status
  `);
  
  // Blog posts by category
  const blogByCategoryResult = await query(`
    SELECT 
      bc.name as category,
      COUNT(bp.id) as count
    FROM blog_categories bc
    LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.status = 'published'
    GROUP BY bc.name
    ORDER BY count DESC
  `);
  
  // Most viewed blog posts
  const mostViewedPostsResult = await query(`
    SELECT id, title, slug, views, published_at
    FROM blog_posts
    WHERE status = 'published'
    ORDER BY views DESC
    LIMIT 10
  `);
  
  // Portfolio projects by category
  const portfolioByCategoryResult = await query(`
    SELECT category, COUNT(*) as count
    FROM portfolio
    WHERE is_active = true
    GROUP BY category
  `);
  
  // Testimonials count
  const testimonialsResult = await query(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
    FROM testimonials
  `);
  
  res.json({
    success: true,
    data: {
      blogByStatus: blogByStatusResult.rows,
      blogByCategory: blogByCategoryResult.rows,
      mostViewedPosts: mostViewedPostsResult.rows,
      portfolioByCategory: portfolioByCategoryResult.rows,
      testimonials: testimonialsResult.rows[0]
    }
  });
};

/**
 * Get revenue analytics
 */
exports.getRevenueAnalytics = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = '1=1';
  const params = [];
  
  if (startDate && endDate) {
    dateFilter = 'created_at BETWEEN $1 AND $2';
    params.push(startDate, endDate);
  }
  
  // Revenue by month
  const revenueByMonthResult = await query(`
    SELECT 
      TO_CHAR(created_at, 'YYYY-MM') as month,
      COUNT(*) as order_count,
      COALESCE(SUM(total), 0) as revenue
    FROM orders
    WHERE ${dateFilter} AND status IN ('completed', 'processing')
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month ASC
  `, params);
  
  // Revenue by product category
  const revenueByCategoryResult = await query(`
    SELECT 
      p.category,
      COUNT(DISTINCT o.id) as order_count,
      SUM(oi.quantity) as items_sold,
      COALESCE(SUM(oi.price * oi.quantity), 0) as revenue
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.${dateFilter} AND o.status IN ('completed', 'processing')
    GROUP BY p.category
    ORDER BY revenue DESC
  `, params);
  
  // Average order value
  const avgOrderValueResult = await query(`
    SELECT 
      ROUND(AVG(total)::numeric, 2) as avg_order_value,
      MIN(total) as min_order_value,
      MAX(total) as max_order_value
    FROM orders
    WHERE ${dateFilter} AND status IN ('completed', 'processing')
  `, params);
  
  res.json({
    success: true,
    data: {
      revenueByMonth: revenueByMonthResult.rows,
      revenueByCategory: revenueByCategoryResult.rows,
      orderValueStats: avgOrderValueResult.rows[0]
    }
  });
};