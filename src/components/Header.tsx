import { VoidComponent } from 'solid-js'
import { Logo } from './Logo'

export const Header: VoidComponent = () => {
  return (
    <div class="bg-white">
      <div class='bg-white w-full px-2 pb-2 pt-16 flex flex-row justify-center max-w-5xl mx-auto'>
        <Logo />
      </div>
    </div>
  )
}
