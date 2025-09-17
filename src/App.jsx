import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TaskListPage from './pages/TaskListPage';
import DeletedListPage from './pages/DeletedListPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import PhasesPage from './pages/PhasesPage';
import PrioritiesPage from './pages/PrioritiesPage';
import StatusPage from './pages/StatusPage';
import ProfilePage from './pages/ProfilePage';
import { AppLayout } from './components';
import  ProtectedRoutes  from './routes/ProtectedRoutes'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authActions';
import { Loader } from './components';

function App() {
    const dispatch=useDispatch();
    const { loading } = useSelector((state)=>state.auth);

    useEffect(()=>{
      dispatch(checkAuth());
    },[dispatch])

    if(loading){
      return <Loader />
    }

    return (
      <Routes>
        {/* Public Route */}
        <Route path='/login' element={<LoginPage />}></Route>

        {/* Private Route */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path='/tasks' element={<TaskListPage />}/>
            <Route path='/deleted' element={<DeletedListPage />}/>
            <Route path='/dashboard' element={<DashboardPage />}/>
            <Route path='/clients' element={<ClientsPage />}/>
            <Route path='/phases' element={<PhasesPage />}/>
            <Route path='/priorities' element={<PrioritiesPage />}/>
            <Route path='/statuses' element={<StatusPage />}/>
            <Route path='/profile' element={<ProfilePage />}/>
          </Route>
        </Route>

        <Route path='*' element={<Navigate to="/dashboard" replace />} />
      </Routes>
    )
}

export default App
