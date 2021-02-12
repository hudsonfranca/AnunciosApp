import React from 'react'
import ReactPaginate from 'react-paginate'
import '../styles/components/pagination.css'

interface Props {
  pageCount: number
  advertsPerPage: number
  changePage(selectedItem: { selected: number }): void
}

export const Pagination: React.FC<Props> = ({
  advertsPerPage,
  pageCount,
  changePage
}) => {
  return (
    <>
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={changePage}
        previousLabel={'Anterior'}
        nextLabel={'próxima'}
        breakLabel={'...'}
        containerClassName={'pagination'}
        activeClassName={'active'}
        subContainerClassName={"pages pagination"}
         breakClassName={"break-me"}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
      />
    </>
  )
}
