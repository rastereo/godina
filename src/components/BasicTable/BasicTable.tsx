import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import mainApi from '../../utils/MainApi';

import colorGradient from '../../utils/colorGradient';

// function createData(
//   name: string,
//   score: number,
// ) {
//   // eslint-disable-next-line object-curly-newline
//   return { name, score };
// }

export default function BasicTable() {
  const [topScore, setTopScore] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const reducedGradient: string[] = colorGradient
    .filter((color, index) => index % 3 === 0);

  const userName = localStorage.getItem('name');

  useEffect(() => {
    mainApi.getTopScore()
      .then((data) => {
        setTopScore(data.top_scores);
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
      });
  }, []);

  return (
    <>
      {error
        ? <h3 className="top-user__title">{error.message}</h3>
        : <h3 className="top-user__title">Лучшие игроки</h3>}
      <TableContainer
        component={Paper}
        sx={{
          width: {
            xs: '100%', // 100% ширина, когда ширина экрана <= 400px
            sm: '50%', // 35% ширина, когда ширина экрана > 400px
          },
          margin: '0 auto ',
          background: 'black',
        }}
      >
        <Table
          sx={{
            // minWidth: 650,
            width: '100%',
            color: 'white',
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {/* <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {topScore && topScore.map((user: { name: string, score: number }, index: number) => (
              <TableRow
                key={user.name}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                  color: 'white',
                  // border: '2px solid red',
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    color: reducedGradient[index],
                    fontSize: '20px',
                    border: user.name === userName ? '' : 'none',
                    borderColor: user.name === userName ? '' : reducedGradient[index],
                  }}
                >
                  <span className="top-users__position">{index + 1}</span>
                  {index === 0 && '👑'}
                  {user.name}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: reducedGradient[index],
                    fontSize: '20px',
                    border: user.name === userName ? '' : 'none',
                    borderColor: user.name === userName ? '' : reducedGradient[index],
                  }}
                >
                  {user.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
