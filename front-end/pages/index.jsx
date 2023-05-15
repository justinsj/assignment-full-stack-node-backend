import { Link } from 'components';

export default Home;

function Home() {
    return (
        <div>
            <h1>Bankroll App</h1>
            {/* <p>An example app showing how to list, add, edit and delete employee records with Next.js 10 and the React Hook Form library.</p> */}
            <p><Link href="/employees">&gt;&gt; Manage Employees</Link></p>
        </div>
    );
}
