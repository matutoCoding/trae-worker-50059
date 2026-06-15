import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import InmateProfile from '@/pages/InmateProfile';
import Education from '@/pages/Education';
import Training from '@/pages/Training';
import Psychology from '@/pages/Psychology';
import Behavior from '@/pages/Behavior';
import Family from '@/pages/Family';
import Release from '@/pages/Release';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<InmateProfile />} />
        <Route path="/education" element={<Education />} />
        <Route path="/training" element={<Training />} />
        <Route path="/psychology" element={<Psychology />} />
        <Route path="/behavior" element={<Behavior />} />
        <Route path="/family" element={<Family />} />
        <Route path="/release" element={<Release />} />
      </Routes>
    </Layout>
  );
}

export default App;
