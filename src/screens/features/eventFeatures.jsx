import { View, Text } from 'react-native'
import React, { Suspense } from 'react'
import Fallback from '../../components/fallback/fallback';

const Features = React.lazy(() => import('./features'));
const EventFeatures = () => {
  return (
    <>
    <Suspense fallback={<Fallback />}>
      <Features />
    </Suspense>
    </>
  )
}

export default EventFeatures