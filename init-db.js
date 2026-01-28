require('dotenv').config();
const db = require('./models');

async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    await db.sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync all models (this will create tables)
    console.log('Creating database tables...');
    await db.sequelize.sync({ force: true }); // WARNING: force:true will drop existing tables
    console.log('✓ Database tables created');

    // Create default admin user
    console.log('Creating default admin user...');
    await db.Admin.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('✓ Default admin user created');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  ⚠ Please change this password after first login!');

    // Create sample event
    await db.Event.create({
      title: 'School Annual Day 2026',
      description: 'Join us for our annual day celebration with performances, awards, and fun activities!',
      eventDate: new Date('2026-03-15'),
      location: 'School Auditorium',
      published: true
    });
    console.log('✓ Sample event created');

    // Create sample blog
    await db.Blog.create({
      title: 'Welcome to Our School Blog',
      content: 'We are excited to launch our new school blog where we will share updates, stories, and achievements from our school community. Stay tuned for more posts!',
      excerpt: 'Introducing our new school blog for updates and news.',
      author: 'Admin',
      published: true
    });
    console.log('✓ Sample blog post created');

    // Create sample hero slides
    await db.HeroSlide.create({
      title: 'Welcome to Our School',
      subtitle: 'Excellence in Education',
      description: 'Providing quality education and nurturing future leaders',
      buttonText: 'Learn More',
      buttonLink: '/about',
      order: 1,
      active: true
    });
    
    await db.HeroSlide.create({
      title: 'Join Our Community',
      subtitle: 'Building Bright Futures',
      description: 'Where learning meets innovation',
      buttonText: 'Join Us',
      buttonLink: '/membership',
      order: 2,
      active: true
    });
    console.log('✓ Sample hero slides created');

    // Create sample highlights
    await db.Highlight.create({
      title: 'Students Enrolled',
      description: 'Growing community of learners achieving excellence',
      category: 'Education',
      metric: '500+ students',
      percentage: 100,
      year: '2025',
      order: 1,
      active: true
    });
    
    await db.Highlight.create({
      title: 'Success Rate',
      description: 'Outstanding academic performance across all levels',
      category: 'Achievement',
      metric: '95% success',
      percentage: 95,
      year: '2025',
      order: 2,
      active: true
    });
    console.log('✓ Sample highlights created');

    // Create sample board members
    await db.BoardMember.create({
      name: 'Dr. Jane Smith',
      position: 'Board Chairman',
      bio: 'Leading educator with 20 years of experience in academic excellence',
      company: 'Education Excellence Foundation',
      email: 'jane.smith@example.com',
      order: 1,
      featured: true,
      active: true
    });
    
    await db.BoardMember.create({
      name: 'Prof. John Doe',
      position: 'Vice Chairman',
      bio: 'Renowned professor and education policy expert',
      company: 'National Education Board',
      email: 'john.doe@example.com',
      order: 2,
      featured: true,
      active: true
    });
    console.log('✓ Sample board members created');

    console.log('\n✓ Database initialization complete!');
    console.log('You can now start the server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
