import React from 'react';

import {
  isErrorResult,
  isPendingResult,
  AsyncResult,
} from 'helpers/asyncResults';

import { NotablePersonQuery } from 'api/types';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { NotablePersonSkeleton } from './NotablePersonSkeleton';
import { Status } from 'components/Status/Status';
import { WithData } from 'hocs/WithData/WithData';
import { LinkButton } from 'components/Button/Button';
import { withRouter, RouteComponentProps } from 'react-router';
import { forceReload } from 'helpers/forceReload';
import query from './NotablePersonQuery.graphql';
import { NonErrorNotablePerson } from './NonErrorNotablePerson';

import {
  AppDependenciesContext,
  AppDependencies,
} from 'appDependenciesContext';
import { warningIcon } from './warningIcon';

export type Props = {};

const Page = withRouter(
  class extends React.Component<Props & RouteComponentProps<any>> {
    createLoad = ({
      apiClient,
    }: Pick<AppDependencies, 'apiClient'>) => async () => {
      const { slug } = this.props.match.params;

      return apiClient.request<NotablePersonQuery>(query, { slug });
    };

    render() {
      const pageUrl = this.props.history.createHref(this.props.location);
      const { slug } = this.props.match.params;

      return (
        <AppDependenciesContext.Consumer>
          {dependencies => {
            return (
              <WithData
                requestId={slug}
                dataKey="notablePersonQuery"
                forPage={pageUrl}
                load={this.createLoad(dependencies)}
              >
                {({
                  result,
                }: {
                  result: AsyncResult<NotablePersonQuery | null>;
                }) => {
                  if (result.value === null || isPendingResult(result)) {
                    return <NotablePersonSkeleton />;
                  }

                  if (isErrorResult(result)) {
                    const { location } = this.props;

                    return (
                      <MessageWithIcon
                        title="Are you connected to the internet?"
                        description="Please check your connection and try again"
                        button={
                          <LinkButton to={location} onClick={forceReload}>
                            Reload
                          </LinkButton>
                        }
                        icon={warningIcon}
                      >
                        <Status code={500} />
                      </MessageWithIcon>
                    );
                  }

                  return (
                    <NonErrorNotablePerson
                      // tslint:disable-next-line:no-non-null-assertion
                      notablePerson={result.value!.notablePerson}
                    />
                  );
                }}
              </WithData>
            );
          }}
        </AppDependenciesContext.Consumer>
      );
    }
  },
);

export const NotablePerson = Page;
