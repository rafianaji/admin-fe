import { CPagination, CPaginationItem } from '@coreui/react';
import React from 'react';

export default function Pagination(props) {
  const {
    page,
    setPagination,
    setPreviousPagination,
    setNextPagination,
    totalCount,
    count
  } = props;
  return (
    <>
      <CPagination align="end" size="sm" className="mt-3">
        {Number(page) > 3 && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPagination(1);
            }}
          >
            {'<<'}
          </CPaginationItem>
        )}
        {Number(page) > 1 && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPreviousPagination();
            }}
          >
            Previous
          </CPaginationItem>
        )}
        {page > 2 && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPagination(page - 2);
            }}
          >
            {page - 2}
          </CPaginationItem>
        )}
        {page > 1 && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPagination(page - 1);
            }}
          >
            {page - 1}
          </CPaginationItem>
        )}
        <CPaginationItem className="active">{page}</CPaginationItem>
        {page < Math.ceil(totalCount / count) && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPagination(page + 1);
            }}
          >
            {Number(page) + 1}
          </CPaginationItem>
        )}
        {page < Math.ceil(totalCount / count) - 1 && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPagination(page + 2);
            }}
          >
            {Number(page) + 2}
          </CPaginationItem>
        )}
        {page < Math.ceil(totalCount / count) && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setNextPagination();
            }}
          >
            Next
          </CPaginationItem>
        )}
        {page < Math.ceil(totalCount / count) - 2 && (
          <CPaginationItem
            className="cursor-pointer"
            onClick={() => {
              setPagination(Math.ceil(totalCount / count));
            }}
          >
            {'>>'}
          </CPaginationItem>
        )}
      </CPagination>
    </>
  );
}
