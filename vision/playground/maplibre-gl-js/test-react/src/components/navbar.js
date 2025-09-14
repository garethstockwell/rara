import React from 'react';
import './navbar.css';

export default function Navbar({
  data,
  onSelect
}){
  return (
    <div className="heading">
    <h1>
      <ul>
        {
          data.map(item => (
            <li key={item}>
              <button onClick={() => onSelect(item)}>
                {item}
              </button>
            </li>
          ))
        }
      </ul>
    </h1>
    </div>
  );
}
