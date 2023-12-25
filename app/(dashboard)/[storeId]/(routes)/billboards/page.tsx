import React from 'react'
import BillboardClient from './components/BillboardClient'

type Props = {}

const BillboardsPage = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <BillboardClient/>
      </div>
    </div>
  )
}

export default BillboardsPage