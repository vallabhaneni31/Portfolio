import { Fragment, type ElementType } from 'react';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
}

/** Wraps each word in a mask so GSAP can slide it up. Screen readers get the plain text. */
export function Split({ text, as: Tag = 'span', className, id }: Props) {
  const words = text.split(' ');
  return (
    <Tag className={className} id={id} data-split aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
              <span data-split-inner style={{ display: 'inline-block' }}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
