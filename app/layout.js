import { getMenu } from '@/lib/api'
import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {

  const menu = getMenu()




  return (
    <html lang="en">
      <body className="pl-[200px]">
        <div className='fixed w-[200px] h-screen left-0 bg-slate-500' >
          {
            menu.map((el) => {
              return (
                <div>
                  {Object.keys(el)}
                  <div className='pl-[15px]'>
                    {el[Object.keys(el)].map((menu) => {
                      return (
                        <Link href={`${menu}`}>
                          <div>
                            {menu}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })
          }
        </div>
        <div>{children}</div></body>
    </html>
  )
}
