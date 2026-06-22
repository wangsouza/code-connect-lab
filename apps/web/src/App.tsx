import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './components/pages/LoginPage/LoginPage'
import { SignupPage } from './components/pages/SignupPage/SignupPage'
import { FeedPage } from './components/pages/FeedPage/FeedPage'
import { PostDetailPage } from './components/pages/PostDetailPage/PostDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* Feed e detalhes são públicos: visitantes podem ler, mas não interagir. */}
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/posts/:slug" element={<PostDetailPage />} />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}

export default App
