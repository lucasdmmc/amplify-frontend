import React from 'react';
import awsExports from '../aws-exports';
import { Amplify } from 'aws-amplify';
import { FaceLiveness } from '../components/FaceLivenessDetector';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function IndexPage() {
  return (
    <FaceLiveness />
  );
}

export default IndexPage;