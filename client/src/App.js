
import './App.css';
import Post from './post'
import Header from './header';
import {Route,Routes} from "react-router-dom";
import Layout from './layout';
import IndexPage from './pages/indexpage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import { userContextProvider } from './UserContext';

function App() {
  return (
    <userContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />}/>
        </Route>
        
      </Routes>
      </userContextProvider>

  );
}

export default App;
