import Link from 'next/link';

import { userService } from 'services';

export default Home;

function Home() {
    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {userService.userValue?.firstName}!</h1>
                <p>You&apos;re logged in with Next.js & JWT!!</p>
                <p>This app is styled with Bootstrap</p>
                <p><Link href="/employees">&gt;&gt; Manage Employees</Link></p>
                <p><Link href="/users">&gt;&gt; Manage Users</Link></p>
            </div>
        </div>
    );
}
