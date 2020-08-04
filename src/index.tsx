import React from 'react';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Profile } from './routes/profile';
import { SearchBox } from './SearchBox';
import { RepositoryData_user_repositories } from '~__generated__/RepositoryData';


const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    // cache: new InMemoryCache(),
    // TODO: define read and merge functions for repositories
    cache: new InMemoryCache({
        typePolicies: {
            User: {
                fields: {
                    repositories: {
                        merge(existing: RepositoryData_user_repositories | undefined, incoming: RepositoryData_user_repositories | undefined) {
                            if (!existing) return incoming;
                            return {
                                ...incoming,
                                nodes: [
                                    ...existing.nodes, ...incoming?.nodes
                                ]
                            }
                        },
                        keyArgs: ['orderBy']
                    }
                }
            }
        }
    }),
    headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    }
});

render(
    <ApolloProvider client={client}>
        <Router>
            <SearchBox />
            <Switch>
                <Route path="/:userLogin">
                    <Profile />
                </Route>
                <Route path="*">
                    <div className="flex-1 h-full flex items-center justify-center">
                        <div className="mb-20 flex flex-col items-center">
                            <h1 className="text-2xl text-gray-800 font-bold mb-2">Welcome!</h1>
                            <p>Use the search field above to select a user.</p>
                        </div>
                    </div>
                </Route>
            </Switch>
        </Router>
    </ApolloProvider>,
    document.getElementById('root')
);