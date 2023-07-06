import PropTypes, { array } from "prop-types";
import {
  Box,Card,  Table,  TableBody,  TableCell,  TableHead,  TablePagination,  Button,  TableRow } from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export const PatientsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;


  const router = useRouter();


  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((patient, index) => {
                if (!patient.AssigntoDoctor) {
                  return (
                    <TableRow key={index}>
                      <TableCell>{patient.Firstname}</TableCell>
                      <TableCell>{patient.Lastname}</TableCell>
                      <TableCell>{patient.Patient}</TableCell>  
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage="30"
        rowsPerPageOptions={[30, 35]}
      />
    </Card>
  );
};

PatientsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
