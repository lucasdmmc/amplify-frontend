import React from 'react';
import awsExports from '../aws-exports';
import { Amplify } from 'aws-amplify';
import { FaceLiveness } from '../components/FaceLivenessDetector';
import { FaceLivenessProvider } from '../context/FaceLivenessContext';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function IndexPage() {
  return (
    <FaceLivenessProvider>
      <FaceLiveness />
    </FaceLivenessProvider>
  );
}

export default IndexPage;