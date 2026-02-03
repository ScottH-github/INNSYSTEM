import styles from './Projects.module.css';
import { Link } from '@/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: true,
    },
    orderBy: {
      updatedAt: 'desc',
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Manage and monitor your active interior design works.</p>
        </div>
        <button className={styles.addBtn}>+ New Project</button>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Area</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>No projects found. Create one to get started.</td>
              </tr>
            ) : projects.map((p) => (
              <tr key={p.id}>
                <td className={styles.projectName}>
                  <Link href={`/projects/${p.id}`}>{p.name}</Link>
                </td>
                <td>{p.client.name}</td>
                <td>
                  <span className={`${styles.badge} ${p.status === 'DESIGNING' ? styles.designing : styles.other}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.area} Ping</td>
                <td>{p.updatedAt.toLocaleDateString()}</td>
                <td>
                  <Link href={`/projects/${p.id}`} className={styles.viewLink}>View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
