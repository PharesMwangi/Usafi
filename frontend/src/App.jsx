import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import MaidProfileView from "./pages/MaidProfileView";
import CreateProfile from "./pages/CreateProfile";
import Chat from "./pages/Chat";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/create-profile"
          element={
            <ProtectedRoute role="maid">
              <CreateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute role="employer">
              <Browse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profiles/:id"
          element={
            <ProtectedRoute role="employer">
              <MaidProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
