declare module 'react-tooltip' {
    import * as React from 'react';

    export interface TooltipProps {
      id?: string;
      place?: 'top' | 'right' | 'bottom' | 'left';
      type?: 'dark' | 'success' | 'warning' | 'error' | 'info' | 'light';
      effect?: 'float' | 'solid';
      multiline?: boolean;
      border?: boolean;
      borderColor?: string;
      className?: string;
      delayHide?: number;
      delayShow?: number;
      delayUpdate?: number;
      disable?: boolean;
      event?: string;
      eventOff?: string;
      getContent?: (dataTip: string) => React.ReactNode;
      globalEventOff?: string;
      html?: boolean;
      isCapture?: boolean;
      offset?: { top?: number; right?: number; bottom?: number; left?: number };
      placeContext?: (this: React.Component<TooltipProps>, place: TooltipProps['place']) => void;
      resizeHide?: boolean;
      scrollHide?: boolean;
      insecure?: boolean;
      afterHide?: () => void;
      afterShow?: () => void;
      overridePosition?: (
        left: number,
        top: number,
        currentEvent: Event,
        currentTarget: EventTarget,
        node: HTMLElement,
        place: TooltipProps['place'],
        desiredPlace: TooltipProps['place'],
        offset: TooltipProps['offset']
      ) => { top: number; left: number } | undefined;
    }
  
    export default class ReactTooltip extends React.Component<TooltipProps> {}
  }
  