import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSidebar, CSidebarBrand, CSidebarFooter, CSidebarNav } from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// sidebar nav config
import navigation from '../_nav';
import adminNav from 'src/shared/data/adminNav';

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [visibleLogoutModal, setVisibleLogoutModal] = useState(false);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <h2>DNA</h2>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={adminNav} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarFooter
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setVisibleLogoutModal(true);
        }}
      >
        <SimpleBar>Logout</SimpleBar>
      </CSidebarFooter>

      {/* Logout Modal */}
      <>
        <CModal
          backdrop="static"
          visible={visibleLogoutModal}
          onClose={() => {
            setVisibleLogoutModal(false);
          }}
        >
          <CModalHeader>
            <CModalTitle>Logout</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure?</CModalBody>
          <CModalFooter>
            <CButton
              color="secondary text-white"
              onClick={() => {
                setVisibleLogoutModal(false);
              }}
            >
              Cancel
            </CButton>
            <CButton
              color="danger text-white"
              onClick={async () => {
                await localStorage.clear();
                window.location.reload();
              }}
            >
              Yes
            </CButton>
          </CModalFooter>
        </CModal>
      </>
      {/*  */}
    </CSidebar>
  );
}
