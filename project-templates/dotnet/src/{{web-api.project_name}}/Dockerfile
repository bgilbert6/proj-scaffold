# ### Builder Image ###
# This image is not included in the deployment.

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS builder

ARG GIT_SHA=snapshot
ARG GIT_BRANCH=snapshot
ARG BUILD_NUMBER=0.0.1
ARG NEWRELIC_VERSION=8.20.262.0


ENV NEWRELIC_VERSION ${NEWRELIC_VERSION}
RUN curl -s https://download.newrelic.com/dot_net_agent/previous_releases/${NEWRELIC_VERSION}/newrelic-netcore20-agent_${NEWRELIC_VERSION}_amd64.tar.gz --output /usr/local/newrelic-netcore20-agent_${NEWRELIC_VERSION}_amd64.tar.gz
RUN tar -C /usr/local/ -xzf /usr/local/newrelic-netcore20-agent_${NEWRELIC_VERSION}_amd64.tar.gz


WORKDIR /app

# --- restore the entire solution in a separately cached layer ---
# Do not copy all files here, as it will slow down builds.

COPY ./src/{{web-api.project_name}}/ ./src/{{name}}/src/{{web-api.project_name}}/
COPY ./nuget.config ./

RUN dotnet restore "src/{{name}}/src/{{web-api.project_name}}/{{web-api.project_name}}.csproj"

# --- copy and build all source ---

COPY . ./

ENV GIT_SHA ${GIT_SHA}
ENV GIT_BRANCH ${GIT_BRANCH}
ENV BUILD_NUMBER ${BUILD_NUMBER}

WORKDIR /app/src/{{name}}/src/{{web-api.project_name}}

RUN dotnet publish "{{web-api.project_name}}.csproj" -c Release -o out

# ### Runtime Image ###
# This image is what gets deployed.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS runtime

ENV ASPNETCORE_URLS http://+:80
EXPOSE 80

COPY --from=builder /usr/local/newrelic-netcore20-agent /usr/local/newrelic-netcore20-agent

ENV CORECLR_NEWRELIC_HOME=/usr/local/newrelic-netcore20-agent
ENV CORECLR_ENABLE_PROFILING=1
ENV CORECLR_PROFILER={36032161-FFC0-4B61-B559-F6C5D41BAE5A}
ENV CORECLR_PROFILER_PATH=${CORECLR_NEWRELIC_HOME}/libNewRelicProfiler.so

WORKDIR /app
COPY --from=builder /app/src/{{name}}/src/{{web-api.project_name}}/out ./

ARG GIT_SHA=snapshot
ARG GIT_BRANCH=snapshot
ARG BUILD_NUMBER=0.0.1

ENV GIT_SHA ${GIT_SHA}
ENV GIT_BRANCH ${GIT_BRANCH}
ENV BUILD_NUMBER ${BUILD_NUMBER}

ENTRYPOINT ["dotnet", "{{web-api.project_name}}.dll"]
