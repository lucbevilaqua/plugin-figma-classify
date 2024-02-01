import React from 'react';
import { TableProps } from './types';
import './styles.css';

const Table = ({ children }: TableProps) => {

  return (
    <>
      <table className="table-container">
        <tbody>
          {children}
        </tbody>
      </table>
    </>
  );
};

export default Table;
