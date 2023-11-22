import React, { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import mainApi from '../../utils/MainApi';

import colorGradient from '../../utils/colorGradient';

export default function BasicTable() {
  const [topScore, setTopScore] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // const colorGradient: string[] = colorGradient
  //   .filter((color, index) => index % 3 === 0);

  const userName = localStorage.getItem('name');

  useEffect(() => {
    mainApi.getTopScore()
      .then((data) => {
        setTopScore(data.top_scores);
      })
      .catch((err) => {
        setError(err);
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
            width: '100%',
          }}
          aria-label="simple table"
        >
          <TableBody>
            {topScore && topScore.map((user: { name: string, score: number }, index: number) => (
              <TableRow
                key={user.name}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                  color: 'white',
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontFamily: 'Better VCR, sans-serif',
                    color: colorGradient[index],
                    fontSize: '20px',
                    border: user.name === userName ? '' : 'none',
                    borderColor: user.name === userName ? '' : colorGradient[index],
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    width: '100%',
                    fontFamily: 'Better VCR, sans-serif',
                    textAlign: 'center',
                    color: colorGradient[index],
                    fontSize: '20px',
                    border: user.name === userName ? '' : 'none',
                    borderColor: user.name === userName ? '' : colorGradient[index],
                  }}
                >
                  {index === 0 && '👑'}
                  {user.name}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontFamily: 'Better VCR, sans-serif',
                    color: colorGradient[index],
                    fontSize: '20px',
                    border: user.name === userName ? '' : 'none',
                    borderColor: user.name === userName ? '' : colorGradient[index],
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
