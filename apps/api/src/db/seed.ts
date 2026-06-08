import { db } from "./drizzle.js";
import { users, tickets, comments, ticketActivity } from "./schema/index.js";
import bcryptjs from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  await db.delete(tickets);
  await db.delete(users);

  const hashedPassword = await bcryptjs.hash("password123", 10);

  const seededUsers = await db
    .insert(users)
    .values([
      {
        name: "Admin User",
        email: "admin@opsflow.local",
        passwordHash: hashedPassword,
        role: "admin",
      },
      {
        name: "Agent User",
        email: "agent@opsflow.local",
        passwordHash: hashedPassword,
        role: "agent",
      },
      {
        name: "Viewer User",
        email: "viewer@opsflow.local",
        passwordHash: hashedPassword,
        role: "viewer",
      },
      {
        name: "Aisha Tan",
        email: "aisha@opsflow.local",
        passwordHash: hashedPassword,
        role: "agent",
      },
      {
        name: "Daniel Lim",
        email: "daniel@opsflow.local",
        passwordHash: hashedPassword,
        role: "viewer",
      },
    ])
    .returning();

  const userIds = seededUsers.map((u) => u.id);

  const statuses = ["open", "in_progress", "resolved", "closed"] as const;
  const priorities = ["low", "medium", "high", "critical"] as const;
  const categories = [
    "access",
    "billing",
    "bug",
    "feature_request",
    "infrastructure",
    "other",
  ] as const;

  const ticketTemplates = [
    {
      title: "Cannot access billing portal",
      description:
        "User receives 403 when opening billing portal.",
      category: "billing",
    },
    {
      title: "VPN connection drops every 30 minutes",
      description:
        "Remote employees report VPN disconnecting frequently during calls.",
      category: "infrastructure",
    },
    {
      title: "Request new laptop for new hire",
      description:
        "Engineering team needs a MacBook Pro for incoming developer starting next week.",
      category: "access",
    },
    {
      title: "Server latency spikes during peak hours",
      description:
        "API response time exceeds 2 seconds between 9 AM and 11 AM.",
      category: "infrastructure",
    },
    {
      title: "Password reset email not arriving",
      description:
        "Users clicking 'Forgot Password' do not receive reset emails.",
      category: "bug",
    },
    {
      title: "Database backup failure",
      description: "Nightly backup job failed with disk space error.",
      category: "infrastructure",
    },
    {
      title: "Unable to print to office printer",
      description: "Printer shows offline for all users on floor 3.",
      category: "access",
    },
    {
      title: "Feature request: dark mode",
      description: "Users requesting dark mode for the dashboard.",
      category: "feature_request",
    },
    {
      title: "SSL certificate expiring soon",
      description: "Production SSL certificate expires in 7 days.",
      category: "infrastructure",
    },
    {
      title: "Email notifications delayed",
      description: "Ticket update emails arriving 30 minutes late.",
      category: "bug",
    },
    {
      title: "New user onboarding access",
      description: "Need to provision accounts for 3 new interns.",
      category: "access",
    },
    {
      title: "Invoice discrepancy",
      description: "Client reports overcharge on last month invoice.",
      category: "billing",
    },
    {
      title: "Mobile app crashes on login",
      description: "iOS app crashes when users tap the login button.",
      category: "bug",
    },
    {
      title: "Request additional cloud storage",
      description: "Design team needs more S3 storage for asset backups.",
      category: "infrastructure",
    },
    {
      title: "Two-factor auth not working",
      description: "TOTP codes rejected as invalid by the auth server.",
      category: "access",
    },
    {
      title: "API rate limit too low",
      description: "Partner integration hitting rate limits.",
      category: "feature_request",
    },
    {
      title: "Staging environment down",
      description: "Staging returns 502 Bad Gateway.",
      category: "infrastructure",
    },
    {
      title: "Payment gateway timeout",
      description: "Stripe webhook deliveries timing out.",
      category: "billing",
    },
    {
      title: "Export to CSV fails for large datasets",
      description: "Export crashes when more than 10,000 rows selected.",
      category: "bug",
    },
    {
      title: "Request GitHub repository access",
      description: "New developer needs access to backend repository.",
      category: "access",
    },
  ];

  const ticketData = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const template = ticketTemplates[i % ticketTemplates.length];
    const status = statuses[i % statuses.length];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const category =
      i < 20 ? template.category : categories[i % categories.length];
    const assigneeId = i % 3 === 0 ? null : userIds[i % userIds.length];
    const createdById = userIds[(i + 1) % userIds.length];
    const dueOffset = (i % 7 - 3) * 24 * 60 * 60 * 1000;
    const dueAt = new Date(now.getTime() + dueOffset);

    ticketData.push({
      title: `${template.title} #${i + 1}`,
      description: template.description,
      status,
      priority,
      category,
      assigneeId,
      createdById,
      dueAt,
    });
  }

  await db.insert(tickets).values(ticketData);

  const seededTickets = await db.select({ id: tickets.id }).from(tickets).limit(10);
  const commentBodies = [
    "I reproduced this issue on Chrome and Safari.",
    "Checking the server logs now.",
    "This seems related to the recent deployment.",
    "Can you provide more details about the error?",
  ];

  for (const ticket of seededTickets) {
    const actorId = userIds[0];
    const comment = await db.insert(comments).values({
      ticketId: ticket.id,
      authorId: actorId,
      body: commentBodies[Math.floor(Math.random() * commentBodies.length)],
    }).returning();

    await db.insert(ticketActivity).values({
      ticketId: ticket.id,
      actorId,
      eventType: "ticket_created",
      metadata: {},
    });

    await db.insert(ticketActivity).values({
      ticketId: ticket.id,
      actorId,
      eventType: "comment_added",
      metadata: { commentId: comment[0].id },
    });
  }

  console.log("Seeded 5 users, 50 tickets, and some comments/activity.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
