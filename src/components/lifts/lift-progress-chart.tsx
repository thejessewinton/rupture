'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import * as d3 from 'd3'
import { eachMonthOfInterval, endOfMonth, format, parseISO, startOfMonth } from 'date-fns'
import { motion } from 'framer-motion'
import { useResizeDetector } from 'react-resize-detector'
import { sortBy } from 'remeda'

import { EmptyState } from '~/components/actions/empty-state'
import { type RouterOutputs } from '~/trpc/shared'
import { estimatedMax } from '~/utils/core'

type LiftProgressChartProps = {
  lift: NonNullable<RouterOutputs['lifts']['getBySlug']>
}

export const LiftProgressChart = ({ lift }: LiftProgressChartProps) => {
  const { ref, height, width } = useResizeDetector()

  if (!lift.sets.some((set) => set.reps > 0)) {
    return (
      <EmptyState>
        <p className='text-neutral-500 dark:text-neutral-400'>No sets recorded</p>
      </EmptyState>
    )
  }

  const liftsByDate = sortBy([...lift.sets], [(s) => s.date, 'desc'])

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
    <div className='relative h-72 w-full' ref={ref}>
      {width && height && width > 0 && <ChartInner data={data} width={width} height={height} />}
    </div>
  )
}

type ChartInnerProps = {
  data: {
    date: Date
    estimatedMax: number
    weight: number
  }[]
  width: number
  height: number
}

const ChartInner = ({ data, width, height }: ChartInnerProps) => {
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
    <svg viewBox={`0 0 ${width} 288`}>
      {months.map((month, i) => {
        const computedHeight = height - margin.bottom < 0 ? 0 : height - margin.bottom
        return (
          <g key={i} className='text-gray-400' transform={`translate(${xScale(month)},0)`}>
            {i % 2 === 1 && (
              <rect
                width={xScale(endOfMonth(month)) - xScale(month)}
                height={computedHeight}
                className='fill-neutral-100 text-gray-100 dark:fill-neutral-900'
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
        )
      })}

      {yScale.ticks(5).map((max) => (
        <g transform={`translate(0,${yScale(max)})`} className='text-gray-400' key={max}>
          <line x1={margin.left} x2={width - margin.right} stroke='currentColor' strokeDasharray='1,3' />
          <text alignmentBaseline='middle' className='text-[10px]' fill='currentColor'>
            {max}
          </text>
        </g>
      ))}

      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, type: 'spring' }}
        d={d!}
        fill='none'
        className='stroke-blue-300'
        strokeWidth='2'
      />

      {data.map((d, i) => (
        <Tooltip.Provider key={i}>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger asChild>
              <circle
                r='5'
                cx={xScale(d.date)}
                cy={yScale(d.estimatedMax)}
                className='cursor-pointer fill-blue-300'
                strokeWidth={2}
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
  )
}
