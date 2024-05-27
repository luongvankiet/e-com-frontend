import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'src/hooks/routes';
import { useSnackbar } from 'src/components/snackbar';
import { useFormik } from 'formik';
import { Tab, Tabs } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import UserGeneralForm from './user-general-form';

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'billing',
    label: 'Billing',
    icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: 'social',
    label: 'Social links',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

const UserCreateEditForm = ({ currentUser }) => {
  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'general' && <UserGeneralForm currentUser={currentUser} />}
    </>
  );
};

UserCreateEditForm.propTypes = { currentUser: PropTypes.object };

export default UserCreateEditForm;
