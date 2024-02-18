const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding the database.");
  try {
    // Clear the database.
    await prisma.comment.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.userProfile.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.friends.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.shoppingCart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.video.deleteMany({});
    await prisma.user.deleteMany({});

    // Create users
    const user1 = await prisma.user.create({
      data: {
        username: "user1",
        firstName: "John",
        lastName: "Doe",
        email: "user1@example.com",
        password: "password1",
        seller: true,
        location: "New York",
      },
    });

    const user2 = await prisma.user.create({
      data: {
        username: "user2",
        firstName: "Jane",
        lastName: "Doe",
        email: "user2@example.com",
        password: "password2",
        seller: false,
        location: "Los Angeles",
      },
    });    

    // Create product
    const product = await prisma.product.create({
      data: {
        name: "Bucket Hat",
        description: "Recycled Upcycled Denim Bucket Hat",
        size: "Medium",
        price: 60.00,
        quantity: 10,
        seller: {
          connect: {id: user1.id}
        },
        imageUrl:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Facrolandtimbers.com%2F%3Fk%3Dblack-bucket-hat-jj-y0xrP2Fy&psig=AOvVaw1Cl-aLuP75ykBNLyU5KjiE&ust=1707687571645000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPDyyoreoYQDFQAAAAAdAAAAABAQ",
      },
    });

    // Create cart
    const shoppingCart = await prisma.shoppingCart.create({
      data: {
        status: "active",
        totalAmount: 0.00,
        user: { connect: { id: user1.id } }
      },
    });

    // Create cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity: 1,
        product: {
          connect: {
            id: product.id,
          },
        },
        cart: {
          connect: {
            id: shoppingCart.id,
          },
        },
      },
    });


    // Create posts
    const post1 = await prisma.post.create({
      data: {
        title: "First Post",
        content: "This is the content of the first post.",
        published: true,
        authorId: user1.id,
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: "Second Post",
        content: "This is the content of the second post.",
        published: true,
        authorId: user2.id,
      },
    });

    // Create tags
    const tag1 = await prisma.tag.create({
      data: {
        name: "Technology",
        post: {
          connect: [{ id: post1.id }, { id: post2.id }],
        },
      },
    });

    const tag2 = await prisma.tag.create({
      data: {
        name: "Travel",
        post: {
          connect: [{ id: post2.id }],
        },
      },
    });

    // Create comments
    const comment1 = await prisma.comment.create({
      data: {
        text: "Great post!",
        post: {
          connect: { id: post1.id },
        },
        user: {
          connect: { id: user2.id },
        },
      },
    });

    const comment2 = await prisma.comment.create({
      data: {
        text: "Interesting topic!",
        post: {
          connect: { id: post2.id },
        },
        user: {
          connect: { id: user1.id },
        },
      },
    });

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;