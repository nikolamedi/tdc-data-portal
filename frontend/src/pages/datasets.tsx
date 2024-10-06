import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { unstable_serialize } from "swr";
import Layout from "../components/_shared/Layout";
import { Group, PackageSearchOptions } from "@portaljs/ckan";
import { CKAN } from "@portaljs/ckan";
import { env } from "@env.mjs";
import Heading from "@components/_shared/Heading";
import SearchBar from "@components/search/SearchBar";
import Image from "next/image";
import Link from "next/link";
import { listGroups } from "@utils/group";
import { listOrganizations } from "@utils/organization";
import SearchBarMocked from "@components/search/SearchBarMocked";
import { appRouter } from "@/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { api } from "@utils/api";
import { Skeleton } from "@components/ui/skeleton";

export async function getStaticProps() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { session: null },
    transformer: superjson,
  });
  const topics = await listGroups({
    type: "topic",
    showCoordinates: false,
  });
  await Promise.all([
    helpers.dataset.search.prefetch({
      limit: 10,
      tdc_category: "tdc_harmonized",
    }),
    await Promise.all(
      topics.map((topic) => helpers.group.get.prefetch({ id: topic.id }))
    ),
    await helpers.ga.getVisitorStats.prefetch()
  ]);
  return {
    props: {
      topics,
      trpcState: helpers.dehydrate(),
    },
  };
}

export default function DatasetsPage({
  topics,
  trpcState,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  const { data: listOfTopics } = api.group.list.useQuery(
    {
      type: "topic",
      showGeographyShapes: false,
    },
    {
      initialData: topics,
    }
  );
  const { data: tdcHarmonizedDatasets } = api.dataset.search.useQuery({
    limit: 10,
    tdc_category: "tdc_harmonized",
  });
  const { data: gaData } = api.ga.getVisitorStats.useQuery()
  return (
    <>
      <Head>
        <title>Datasets</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect={true}>
        <div className="container">
          <div className="mx-auto flex flex-col pt-[96px] lg:max-w-[672px]">
            <Heading>Transport Data Commons</Heading>
            <p className="mt-4 text-center text-xl font-normal text-gray-500">
              Transport and mobility insights and facts across 32 institutions
              and 120+ countries.
            </p>
            <div className="mt-8 ">
              <SearchBarMocked />
            </div>
            <p className="mt-[20px] text-center text-sm font-normal text-gray-500">
              You can also browse the topics below to find what you are looking
              for.
            </p>
          </div>
          <div className="pb-[96px] pt-[80px]">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-[20px] rounded-[8px] bg-white p-5 shadow-[0px_1px_3px_0px_#0000001A]">
                {gaData && (
                  <Image
                    src="/images/icons/group-mostviewed.png"
                    width={48}
                    height={48}
                    alt="TDC Most Viewed Logo"
                  />
                )}
                <div className="flex flex-col gap-4">
                  {gaData ? (
                    <span className="block text-lg font-semibold leading-tight text-gray-900">
                      Most Viewed
                    </span>
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )}
                  <ul className="flex flex-col gap-[12px]">
                    {gaData ? (
                      <>
                        {gaData.map((item) => (
                          <Link
                            href={`/@${item.organization?.name}/${item.name}`}
                            key={`group-${item.name}`}
                            className="text-sm font-medium text-gray-500"
                          >
                            {item.title ?? item.name}
                          </Link>
                        ))}
                      </>
                    ) : (
                      [0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-4 w-12" />
                      ))
                    )}
                  </ul>
                  <Link
                    className="text-sm font-medium text-accent"
                    href="/search"
                  >
                    Show all
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-[20px] rounded-[8px] bg-white p-5 shadow-[0px_1px_3px_0px_#0000001A]">
                {tdcHarmonizedDatasets && (
                  <Image
                    src="/images/icons/group-hamornised.png"
                    width={48}
                    height={48}
                    alt="TDC Harmonized Logo"
                  />
                )}
                <div className="flex flex-col gap-4">
                  {tdcHarmonizedDatasets ? (
                    <span className="block text-lg font-semibold leading-tight text-gray-900">
                      TDC Harmonized
                    </span>
                  ) : (
                    <Skeleton className="h-4 w-24" />
                  )}
                  <ul className="flex flex-col gap-[12px]">
                    {tdcHarmonizedDatasets ? (
                      <>
                        {tdcHarmonizedDatasets.datasets.map((item) => (
                          <Link
                            href={`/@${item.organization?.name}/${item.name}`}
                            key={`group-${item.name}`}
                            className="text-sm font-medium text-gray-500"
                          >
                            {item.title ?? item.name}
                          </Link>
                        ))}
                      </>
                    ) : (
                      [0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-4 w-12" />
                      ))
                    )}
                  </ul>
                  <Link
                    id="show_all_tdc_harmonized"
                    className="text-sm font-medium text-accent"
                    href="/search?tdc_category=tdc_harmonized"
                  >
                    Show all
                  </Link>
                </div>
              </div>
              {listOfTopics?.map((group) => (
                <TopicCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

function TopicCard({ group }: { group: Group }) {
  const { data: groupDetails, isLoading } = api.group.get.useQuery(
    { id: group.id },
    {
      initialData: { ...group, groups: [], packages: [] },
    }
  );
  return (
    <div className="flex flex-col gap-[20px] rounded-[8px] bg-white p-5 shadow-[0px_1px_3px_0px_#0000001A]">
      {groupDetails && groupDetails.image_display_url && (
        <Image
          src={groupDetails.image_display_url}
          width={48}
          height={48}
          alt={groupDetails.title}
        />
      )}
      <div className="flex flex-col gap-4">
        {groupDetails ? (
          <span className="block text-lg font-semibold leading-tight text-gray-900">
            {groupDetails.title}
          </span>
        ) : (
          <Skeleton className="h-4 w-24" />
        )}
        <ul className="flex flex-col gap-[12px]">
          {groupDetails ? (
            <>
              {groupDetails.packages?.map((item) => (
                <Link
                  href={`/@${item.organization?.name}/${item.name}`}
                  key={`group-${item.name}`}
                  className="text-sm font-medium text-gray-500"
                >
                  {item.title ?? item.name}
                </Link>
              ))}
            </>
          ) : (
            [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-12" />)
          )}
        </ul>
        {groupDetails ? (
          <Link
            id={`show_all_${groupDetails.name}`}
            className="text-sm font-medium text-accent"
            href={`/search?topic=${groupDetails?.name}`}
          >
            Show all
          </Link>
        ) : (
          <Skeleton className="h-4 w-12" />
        )}
      </div>
    </div>
  );
}
