import React from 'react'

interface users  {
  name: string;
  id: number 
};

const Header = ({name,id}: users) => {
  return (
    <div>
       hi this a hesder name dynamicname {name} {id}
    </div>
  )
}

export default Header
