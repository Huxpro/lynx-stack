import { DemoCell } from '../components/index.js';

const laneItems = [
  {
    label: 'Photo',
    detail: '88px',
    className: 'h-[88px] bg-primary',
    textClassName: 'text-primary-content',
  },
  {
    label: 'Note',
    detail: '48px',
    className: 'h-[48px] bg-neutral-faint',
    textClassName: 'text-content',
  },
  {
    label: 'Story',
    detail: '72px',
    className: 'h-[72px] bg-primary-muted',
    textClassName: 'text-primary-content',
  },
  {
    label: 'Album',
    detail: '104px',
    className: 'h-[104px] bg-neutral-ambient',
    textClassName: 'text-content',
  },
  {
    label: 'Quote',
    detail: '56px',
    className: 'h-[56px] bg-primary',
    textClassName: 'text-primary-content',
  },
  {
    label: 'Audio',
    detail: '64px',
    className: 'h-[64px] bg-primary-muted',
    textClassName: 'text-primary-content',
  },
];

export function GridLanesDemo() {
  return (
    <view className='w-full flex flex-col gap-[12px]'>
      <DemoCell label='grid-lanes grid-cols-3 flow-tolerance-4'>
        <view className='w-full grid-lanes grid-cols-3 gap-[8px] flow-tolerance-4 bg-neutral-ambient rounded-[12px] p-[8px]'>
          {laneItems.map((item) => (
            <view
              key={item.label}
              className={`rounded-[8px] p-[8px] flex flex-col justify-between ${item.className}`}
            >
              <text className={`${item.textClassName} text-xs font-bold`}>
                {item.label}
              </text>
              <text className={`${item.textClassName} text-xs`}>
                {item.detail}
              </text>
            </view>
          ))}
        </view>
      </DemoCell>

      <DemoCell label='flow-tolerance-normal / infinite / 0'>
        <view className='w-full flex flex-row gap-[8px]'>
          <view className='flex-1 rounded-[8px] bg-neutral-ambient p-[8px] flow-tolerance-normal'>
            <text className='text-content text-xs'>normal</text>
          </view>
          <view className='flex-1 rounded-[8px] bg-neutral-faint p-[8px] flow-tolerance-infinite'>
            <text className='text-content text-xs'>infinite</text>
          </view>
          <view className='flex-1 rounded-[8px] bg-primary p-[8px] flow-tolerance-0'>
            <text className='text-primary-content text-xs'>0px</text>
          </view>
        </view>
      </DemoCell>
    </view>
  );
}
