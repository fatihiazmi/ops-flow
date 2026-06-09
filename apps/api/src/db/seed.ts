import { db } from "./drizzle.js";
import { users, projects, epics, tickets, comments, ticketActivity } from "./schema/index.js";
import bcryptjs from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Clear in dependency-safe order
  await db.delete(comments);
  await db.delete(ticketActivity);
  await db.delete(tickets);
  await db.delete(epics);
  await db.delete(projects);
  await db.delete(users);

  const hashedPassword = await bcryptjs.hash("password123", 10);

  // ── Users ──────────────────────────────────────────────────────
  const seededUsers = await db
    .insert(users)
    .values([
      { name: "Admin User", email: "admin@opsflow.local", passwordHash: hashedPassword, role: "admin" },
      { name: "Agent User", email: "agent@opsflow.local", passwordHash: hashedPassword, role: "agent" },
      { name: "Viewer User", email: "viewer@opsflow.local", passwordHash: hashedPassword, role: "viewer" },
      { name: "Aisha Tan", email: "aisha@opsflow.local", passwordHash: hashedPassword, role: "agent" },
      { name: "Daniel Lim", email: "daniel@opsflow.local", passwordHash: hashedPassword, role: "viewer" },
    ])
    .returning();

  const userIds = seededUsers.map((u) => u.id);

  // ── Projects ───────────────────────────────────────────────────
  const seededProjects = await db
    .insert(projects)
    .values([
      { key: "OPS", name: "OpsFlow Platform", description: "Core operations and platform engineering", leadId: userIds[1] },
      { key: "MRKT", name: "Marketing Site", description: "Public marketing website and campaigns", leadId: userIds[3] },
      { key: "MOB", name: "Mobile App", description: "iOS and Android mobile applications", leadId: userIds[0] },
    ])
    .returning();

  const [opsProject, mrktProject, mobProject] = seededProjects;

  // ── Epics ──────────────────────────────────────────────────────
  const seededEpics = await db
    .insert(epics)
    .values([
      // OPS epics
      { projectId: opsProject.id, title: "Dashboard Reliability", description: "Ensure 99.9% dashboard uptime", status: "in_progress", ownerId: userIds[1] },
      { projectId: opsProject.id, title: "Workflow Automation", description: "Automate repetitive operational workflows", status: "planned", ownerId: userIds[3] },
      // MRKT epics
      { projectId: mrktProject.id, title: "Campaign Landing Pages", description: "Build high-conversion landing pages for Q3 campaigns", status: "in_progress", ownerId: userIds[3] },
      { projectId: mrktProject.id, title: "SEO Improvements", description: "Improve organic search rankings for target keywords", status: "planned", ownerId: userIds[0] },
      // MOB epics
      { projectId: mobProject.id, title: "Offline Experience", description: "Enable core features when offline", status: "in_progress", ownerId: userIds[0] },
      { projectId: mobProject.id, title: "Push Notifications", description: "Implement push notification system", status: "planned", ownerId: userIds[4] },
    ])
    .returning();

  const [opsEpic1, opsEpic2, mrktEpic1, mrktEpic2, mobEpic1, mobEpic2] = seededEpics;

  // ── Tickets/Issues ─────────────────────────────────────────────
  const statuses = ["open", "in_progress", "resolved", "closed"] as const;
  const priorities = ["low", "medium", "high", "critical"] as const;
  const categories = ["access", "billing", "bug", "feature_request", "infrastructure", "other"] as const;
  const issueTypes = ["bug", "task", "story", "improvement", "incident"] as const;

  const issueTemplates = [
    { title: "Cannot access billing portal", description: "User receives 403 when opening billing portal.", category: "billing", issueType: "bug" },
    { title: "VPN connection drops every 30 minutes", description: "Remote employees report VPN disconnecting frequently during calls.", category: "infrastructure", issueType: "incident" },
    { title: "Request new laptop for new hire", description: "Engineering team needs a MacBook Pro for incoming developer starting next week.", category: "access", issueType: "task" },
    { title: "Server latency spikes during peak hours", description: "API response time exceeds 2 seconds between 9 AM and 11 AM.", category: "infrastructure", issueType: "bug" },
    { title: "Password reset email not arriving", description: "Users clicking 'Forgot Password' do not receive reset emails.", category: "bug", issueType: "bug" },
    { title: "Database backup failure", description: "Nightly backup job failed with disk space error.", category: "infrastructure", issueType: "incident" },
    { title: "Unable to print to office printer", description: "Printer shows offline for all users on floor 3.", category: "access", issueType: "incident" },
    { title: "Feature request: dark mode", description: "Users requesting dark mode for the dashboard.", category: "feature_request", issueType: "improvement" },
    { title: "SSL certificate expiring soon", description: "Production SSL certificate expires in 7 days.", category: "infrastructure", issueType: "task" },
    { title: "Email notifications delayed", description: "Ticket update emails arriving 30 minutes late.", category: "bug", issueType: "bug" },
    { title: "New user onboarding access", description: "Need to provision accounts for 3 new interns.", category: "access", issueType: "task" },
    { title: "Invoice discrepancy", description: "Client reports overcharge on last month invoice.", category: "billing", issueType: "bug" },
    { title: "Mobile app crashes on login", description: "iOS app crashes when users tap the login button.", category: "bug", issueType: "bug" },
    { title: "Request additional cloud storage", description: "Design team needs more S3 storage for asset backups.", category: "infrastructure", issueType: "task" },
    { title: "Two-factor auth not working", description: "TOTP codes rejected as invalid by the auth server.", category: "access", issueType: "bug" },
    { title: "API rate limit too low", description: "Partner integration hitting rate limits.", category: "feature_request", issueType: "story" },
    { title: "Staging environment down", description: "Staging returns 502 Bad Gateway.", category: "infrastructure", issueType: "incident" },
    { title: "Payment gateway timeout", description: "Stripe webhook deliveries timing out.", category: "billing", issueType: "incident" },
    { title: "Export to CSV fails for large datasets", description: "Export crashes when more than 10,000 rows selected.", category: "bug", issueType: "bug" },
    { title: "Request GitHub repository access", description: "New developer needs access to backend repository.", category: "access", issueType: "task" },
  ];

  // Distribute 15+ issues per project across OPS, MRKT, MOB
  const projectConfigs = [
    { project: opsProject, epicMap: { 0: opsEpic1, 1: opsEpic2 } },
    { project: mrktProject, epicMap: { 0: mrktEpic1, 1: mrktEpic2 } },
    { project: mobProject, epicMap: { 0: mobEpic1, 1: mobEpic2 } },
  ];

  const now = new Date();
  const seededTickets: { id: string; projectId: string; createdById: string }[] = [];

  let globalTicketIdx = 0;

  for (const { project, epicMap } of projectConfigs) {
    let issueNumber = 1;

    for (let i = 0; i < 15; i++) {
      const template = issueTemplates[globalTicketIdx % issueTemplates.length];
      const status = statuses[globalTicketIdx % statuses.length];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const category = template.category as typeof categories[number];
      const issueType = template.issueType as typeof issueTypes[number];
      const assigneeId = i % 3 === 0 ? null : userIds[i % userIds.length];
      const createdById = userIds[(i + 1) % userIds.length];
      const dueOffset = (i % 7 - 3) * 24 * 60 * 60 * 1000;
      const dueAt = new Date(now.getTime() + dueOffset);

      // Some issues belong to epics, some don't
      const epicKey = (i % 3) as 0 | 1 | 2; // 0, 1, or 2
      const epicId = epicKey === 2 ? null : (epicMap[epicKey]?.id ?? null);

      const issueKey = `${project.key}-${issueNumber}`;

      await db.insert(tickets).values({
        title: `${template.title} (#${globalTicketIdx + 1})`,
        description: template.description,
        status,
        priority,
        category,
        issueType,
        issueNumber,
        issueKey,
        projectId: project.id,
        epicId,
        assigneeId,
        createdById,
        dueAt,
      });

      seededTickets.push({ id: issueKey, projectId: project.id, createdById });
      issueNumber++;
      globalTicketIdx++;
    }
  }

  // ── Comments & Activity on first few tickets ───────────────────
  const commentBodies = [
    "I reproduced this issue on Chrome and Safari.",
    "Checking the server logs now.",
    "This seems related to the recent deployment.",
    "Can you provide more details about the error?",
  ];

  const ticketIds = await db.select({ id: tickets.id }).from(tickets).limit(10);

  for (const ticket of ticketIds) {
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

  console.log("Seeded 5 users, 3 projects, 6 epics, 45 tickets, and some comments/activity.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
