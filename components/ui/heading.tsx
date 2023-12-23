import React from 'react'

type Props = {
  title: string;
  description: string;
}

const Heading = ({ title, description }: Props) => {
  return (
    <div>
      <h2 className="text-3xl tracking-tighter font-semibold">{title}</h2> 
      <p className="text-base text-muted-foreground" >{description}</p>
    </div>
  )
}

export default Heading