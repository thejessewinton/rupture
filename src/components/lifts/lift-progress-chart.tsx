'use client'

import * as d3 from 'd3'
import { eachMonthOfInterval, endOfMonth, format, isSameMonth, parseISO, startOfMonth } from 'date-fns'
import useMeasure from 'react-use-measure'
import { motion } from 'framer-motion'
import { estimatedMax } from '~/utils/core'
import { RouterOutputs } from '~/trpc/shared'
import { sortBy } from 'remeda'
import * as Tooltip from '@radix-ui/react-tooltip'

type LiftProgressChartProps = {
  lift: RouterOutputs['lifts']['getAll'][number]
}

export const LiftProgressChart = ({ lift }: LiftProgressChartProps) => {
  const [ref, bounds] = useMeasure()

  if (!lift.sets.some((set) => set.reps > 0)) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <p className='text-sm italic text-gray-400'>Add a tracked set to see a chart!</p>
      </div>
    )
  }

  const liftsByDate = sortBy([...lift.sets], (s) => s.date)

  const data = liftsByDate
    .map((lift) => {
      return {
        weight: lift.weight,
        date: parseISO(lift.date.toISOString()),
        estimatedMax: estimatedMax({
          reps: lift.reps,
          weight: lift.weight
        })
      }
    })
    .filter((s) => s.estimatedMax)

  return (
    <div className='relative h-full w-full' ref={ref}>
      {bounds.width > 0 && <ChartInner data={data} width={bounds.width} height={bounds.height} />}
    </div>
  )
}

const ChartInner = ({
  data,
  width,
  height
}: {
  data: {
    date: Date
    estimatedMax: number
    weight: number
  }[]
  width: number
  height: number
}) => {
  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 24
  }

  const startDay = startOfMonth(data.at(0)!.date)
  const endDay = endOfMonth(data.at(-1)!.date)
  const months = eachMonthOfInterval({ start: startDay, end: endDay })

  const xScale = d3
    .scaleTime()
    .domain([startDay, endDay])
    .range([margin.left, width - margin.right])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.estimatedMax)!])
    .range([height - margin.bottom, margin.top])

  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))

  const d = line(data.map((d) => [d.date.getTime(), d.estimatedMax]))

  return (
    <>
      <svg className='' viewBox={`0 0 ${width} ${height}`}>
        {/* X axis */}
        {months.map((month, i) => (
          <g key={month.toISOString()} className='text-gray-400' transform={`translate(${xScale(month)},0)`}>
            {i % 2 === 1 && (
              <rect
                width={xScale(endOfMonth(month)) - xScale(month)}
                height={height - margin.bottom}
                className='fill-neutral-800 text-gray-100'
              />
            )}
            <text
              x={(xScale(endOfMonth(month)) - xScale(month)) / 2}
              y={height - 5}
              textAnchor='middle'
              className='text-[10px]'
              fill='currentColor'
            >
              {format(month, 'MMM')}
            </text>
          </g>
        ))}

        {/* Y axis */}
        {yScale.ticks(5).map((max) => (
          <g transform={`translate(0,${yScale(max)})`} className='text-gray-400' key={max}>
            <line x1={margin.left} x2={width - margin.right} stroke='currentColor' strokeDasharray='1,3' />
            <text alignmentBaseline='middle' className='text-[10px]' fill='currentColor'>
              {max}
            </text>
          </g>
        ))}

        {/* Line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, type: 'spring' }}
          d={d!}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        />

        {/* Circles */}
        {data.map((d, i) => (
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={0}>
              <Tooltip.Trigger asChild>
                <motion.circle
                  key={i}
                  r='5'
                  cx={xScale(d.date)}
                  cy={yScale(d.estimatedMax)}
                  fill='currentColor'
                  strokeWidth={2}
                  stroke={months.findIndex((m) => isSameMonth(m, d.date)) % 2 === 1 ? '#f5f5f4' : 'white'}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side='bottom'
                  className='radix-state-closed:animate-scale-out-content radix-state-delayed-open:animate-scale-in-content'
                >
                  <Tooltip.Arrow className='fill-white' />
                  <div className='rounded bg-white p-2 shadow-lg'>
                    <p className='text-xs text-gray-500'>{format(d.date, 'MMM d, yyyy')}</p>
                    <p className='text-sm text-gray-500'>{d.weight}</p>
                    <p className='text-sm text-gray-500'>{d.estimatedMax}</p>
                  </div>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </svg>
    </>
  )
}
