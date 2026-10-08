import Layout from "./app/layout"
import { Routes, Route, Navigate } from 'react-router'
import Issues from "./pages/issues"
import Board from "./pages/board"

const App = () => {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to='/board'></Navigate>}></Route>
          <Route path="/issues" element={<Issues />}></Route>
          <Route path="/board" element={<Board />}></Route>
        </Routes>
      </Layout>
    </div>
  )
}

export default App