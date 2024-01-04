import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './app.scss';
import './app.css';
import ShiftView from '../../components/shiftView/shiftView';
import StartShift from '../../components/startShift/startShift';
import Note from '../../components/note/note';
import Admin from '../../components/admin/admin';

const TimeClockApplication: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<ShiftView />} />
          <Route path='/start-shift' element={<StartShift />} />
          <Route path='/note' element={<Note />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </Router>
  );
};

export default TimeClockApplication;