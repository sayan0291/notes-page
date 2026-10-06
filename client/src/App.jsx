import { Routes,Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/Auth"
import { NotesContextProvider } from "./context/notesContext"
import { MainLayout } from "./components/layouts/MainLayout.jsx"
import { DashLayout } from "./components/layouts/DashLayout.jsx"
import { AuthLayout } from "./components/layouts/AuthLayout.jsx"
import { Hero,NotesPage,Register,Login,Editor,Settings,NotFound } from "./pages";
import useAuth from "./hooks/useAuth.js";
import { Loader } from "./components/common";

function ProtectedRoute({children}) {
  const { loading,user } = useAuth();
  if(loading) return <Loader />;
  if(!user) return <Navigate to='/login' />;

  return children;
}

export default function App(){

  return(
    <>
      <AuthProvider>
        <Routes>
            <Route element={<MainLayout />} >
              <Route path="/" element={<Hero />} />
              <Route path="/not-found" element={<NotFound title="NOT FOUND" number="404" />} />
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Route>
            <Route element={<ProtectedRoute><NotesContextProvider><DashLayout /></NotesContextProvider></ProtectedRoute>}>
              <Route path="/library/all-notes" element={<NotesPage data="allnote" />} />
              <Route path="/library/pinned" element={<NotesPage data="pincheck" />} />
              <Route path="/tags/work" element={<NotesPage data="work" />} />
              <Route path="/tags/personal" element={<NotesPage data="personal" />} />
              <Route path="/tags/ideas" element={<NotesPage data="ideas" />} />
              <Route path="/tags/study" element={<NotesPage data="study" />} />
              <Route path="/editor"  element={<Editor />} />
              <Route path="/settings"  element={<Settings />} />
              <Route path="/editor/:documentId" element={<Editor />} />
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
        </Routes>
      </AuthProvider>
    </>
  )
}
