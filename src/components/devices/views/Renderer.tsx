import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { CategoryHeader, Green, ImportantCategoryHeader, Red, SmallHeader, VisibleLink } from '../../customs';
import { EFeaturesStatus, ENoteType } from '../../../enums';
import { DeviceFeature, FeatureContainer } from '../themed';
import { generateRandomName } from '../util';
import type { IDevice, ILink, INotes } from '../../../types';

export const States: React.FC = () => {
  return (
    <ul>
      <li>
        <Green>
          <i className="icon-ok-squared" />
        </Green>
        Working
      </li>
      <li>
        <Green>
          <i className="icon-puzzle" />
        </Green>
        Partly working
      </li>
      <li>
        <Red>
          <i className="icon-cancel" />
        </Red>
        Not working
      </li>
      <li>
        <i className="icon-help" /> Untested
      </li>
    </ul>
  );
};

export const renderIcon = (item: EFeaturesStatus): ReactElement => {
  switch (item) {
    case EFeaturesStatus.Partly:
      return (
        <Green>
          <i className="icon-puzzle" />
        </Green>
      );
    case EFeaturesStatus.Working:
      return (
        <Green>
          <i className="icon-ok-squared" />
        </Green>
      );
    case EFeaturesStatus.Untested:
      return <i className="icon-help" />;
    case EFeaturesStatus.NotWorking:
    default:
      return (
        <Red>
          <i className="icon-cancel" />
        </Red>
      );
  }
};

export const renderFeatures = (device: IDevice): ReactElement | null => {
  return !device.features || Object.entries(device.features)?.length <= 0 ? null : (
    <>
      <SmallHeader $full>Features:</SmallHeader>
      <States />
      {Object.entries(device.features).map(([category, features]) => {
        return (
          <FeatureContainer key={category}>
            <CategoryHeader>{category}</CategoryHeader>
            {Object.entries(features).map((d) =>
              d[1].map((e) => {
                return (
                  <DeviceFeature key={e}>
                    {e}
                    {renderIcon(d[0] as EFeaturesStatus)}
                  </DeviceFeature>
                );
              }),
            )}
          </FeatureContainer>
        );
      })}
    </>
  );
};

export const renderString = (note: string, links: ILink[] | undefined): ReactElement | ReactNode[] | null | string => {
  if (typeof note !== 'string') {
    console.info(`Element ${String(note)} is not a string. Will not render it`);
    return null;
  }

  const hasLink = note.match(/#{/g);
  if (!hasLink) return note;
  if (!links) return note;

  const splitted: string[] = [];
  const components: React.ReactNode[] = [];

  for (let i = 1; i < hasLink.length + 1; i++) {
    const tag = `#{${i}}`;

    if (splitted.length === 0) {
      splitted.push(...note.split(tag));
    } else {
      const val = splitted[splitted.length - 1]!.split(tag);
      splitted.pop();
      splitted.push(...val);
    }
  }

  for (let i = 0; i < splitted.length; i++) {
    components.push(splitted[i]);
    const link = links.find((e) => e.id === i + 1);

    if (i !== splitted.length - 1) {
      if (link) {
        components.push(
          <VisibleLink key={link.id} to={link.to}>
            {link.text}
          </VisibleLink>,
        );
      } else {
        components.push(<Red>Missing link with id {i}</Red>);
      }
    }
  }

  return components;
};

export const renderList = (note: INotes<ENoteType.List>): ReactElement | ReactElement[] => {
  return (
    <ul key={generateRandomName()}>
      {note.data.map((e) => {
        return typeof e === 'string' ? (
          <li key={e}>{renderString(e, note.links)}</li>
        ) : (
          renderList(e as INotes<ENoteType.List>)
        );
      })}
    </ul>
  );
};

export const renderNote = (note: INotes<ENoteType>[]): ReactElement | ReactElement[] => {
  return note.map((e) => {
    switch (e.type) {
      case ENoteType.List:
        return (
          <ul>
            {(e as INotes<ENoteType.List>).data.map((l) => {
              return typeof l === 'string' ? (
                <li key={l}>{renderString(l, (e as INotes<ENoteType.List>).links)}</li>
              ) : (
                renderList(l as INotes<ENoteType.List>)
              );
            })}
          </ul>
        );
      case ENoteType.Header:
        return (
          <CategoryHeader key={(e as INotes<ENoteType.Header>).data}>
            {renderString((e as INotes<ENoteType.Header>).data, (e as INotes<ENoteType.Header>).links)}
          </CategoryHeader>
        );
      case ENoteType.String:
      default:
        return (
          <p key={(e as INotes<ENoteType.String>).data}>
            {renderString((e as INotes<ENoteType.String>).data, (e as INotes<ENoteType.String>).links)}
          </p>
        );
    }
  });
};

export const renderNotes = (device: IDevice): ReactElement | null => {
  return !device.notes || Object.entries(device.notes)?.length <= 0 ? null : (
    <>
      <SmallHeader>Notes</SmallHeader>
      {Object.entries(device.notes).map((e) => {
        return (
          <React.Fragment key={e[0]}>
            <ImportantCategoryHeader>{e[0]}</ImportantCategoryHeader>
            {renderNote(e[1])}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const renderDescription = (device: IDevice): ReactElement | null => {
  return !device.description ? null : <p>{renderString(device.description.data, device.description.links)}</p>;
};
