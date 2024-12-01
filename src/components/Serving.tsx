import { Component, For } from 'solid-js'
import { Price } from './Serving/Price'

export const Serving: Component<{
  name: string
  priceStudents: string | null
  priceEmployees: string | null
  priceGuests: string | null
  features: string[]
}> = (props) => {
  return (
    <div class='flex h-fit flex-col items-start justify-center rounded-lg bg-white p-4 gap-4'>
      <h1 class='text-[14px] font-bold'>{props.name}</h1>
      <Price pricePrimary={props.priceStudents} priceSecondary={props.priceGuests} />

      {/* <ul>
        <For each={props.features}>
          {(feature) => <li>{feature}</li>}
        </For>
      </ul> */}
    </div>
  )
}
