import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Spinner } from 'components';
import Pagination from 'components/Pagination';
import { SortArrow, nextDirection } from 'components/SortArrow';
import { Layout } from 'components/users';
import { userService } from 'services';
export default Index;


const PAGE_SIZE = 5;

// Define initial sorting state
const initialSortState = {
  column: null,
  direction: null,
};

function Index() {
    const [users, setUsers] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [sortState, setSortState] = useState(initialSortState); 

    useEffect(() => {
        userService.getAll({
          page: currentPage,
          pageSize: PAGE_SIZE,
          sortColumn: sortState.column,
          sortDirection: sortState.direction,
        }).then(({ data, totalPages }) => {
          setUsers(data);
          setTotalPages(totalPages);
        });
      }, [currentPage, sortState.column, sortState.direction]); // Add sort state dependencies
      

      function deleteUser(id) {
        setUsers(users => users.map(x => {
          if (x.id === id) { x.isDeleting = true; }
          return x;
        }));
      
        userService.delete(id).then(() => {
          setUsers(users => users.filter(x => x.id !== id));
      
          if (users.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        });
      }

      function deleteUser(id) {
        setUsers(users =>
          users.map(x => {
            if (x.id === id) {
              x.isDeleting = true;
            }
            return x;
          })
        );
      
        userService.delete(id).then(() => {
            userService.getAll({
                page: currentPage,
                pageSize: PAGE_SIZE,
                sortColumn: sortState.column,
                sortDirection: sortState.direction,
            }).then(({ data, totalPages }) => {
                console.log({data, totalPages});
                setTotalPages(totalPages);
                if (data.length === 0 && totalPages > 0) {
                    setCurrentPage(currentPage - 1);
                }
                else {
                    setUsers(data);
                }
                
            });
        });
      }

      function nextDirection(direction) {
        if (direction === 'asc') return 'desc';
        if (direction === 'desc') return null;
        return 'asc';
      }
      function handlePageChange(page) {
        setCurrentPage(page);
      }
    
      function handleSort(column) {
        setSortState(prevState => {
          if (prevState.column === column) {
            // If the same column is clicked again, toggle the sort direction
            return {
              column: column,
              direction: nextDirection(prevState.direction),
            };
          } else {
            // If a new column is clicked, set the sort column and direction
            return {
              column: column,
              direction: 'asc',
            };
          }
        });
      }
            

    return (
        <Layout>
            <h1>USERS</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th
                            style={{ width: '30%', cursor: 'pointer' }}
                            onClick={() => handleSort('firstName')}
                            >
                            First Name {sortState.column === 'firstName' && <SortArrow direction={sortState.direction} />}
                        </th>
                        <th
                            style={{ width: '30%', cursor: 'pointer' }}
                            onClick={() => handleSort('lastName')}
                        >
                            Last Name {sortState.column === 'lastName' && <SortArrow direction={sortState.direction} />}
                        </th>
                        <th
                            style={{ width: '30%', cursor: 'pointer' }}
                            onClick={() => handleSort('username')}
                        >
                            Username {sortState.column === 'username' && <SortArrow direction={sortState.direction} />}
                        </th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user =>
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/users/edit/${user.id}`} className="btn btn-edit mr-1">Edit</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-delete" style={{ width: '60px' }} disabled={user.isDeleting}>
                                    {user.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {users && !users.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

            {totalPages && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
            <Link href="/users/add" className="btn btn-success float-end">Add User</Link>
        </Layout>
    );
}

