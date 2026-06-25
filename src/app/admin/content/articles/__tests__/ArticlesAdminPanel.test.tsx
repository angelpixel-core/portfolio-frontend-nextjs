import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ArticlesAdminPanel from "../ArticlesAdminPanel";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

describe("ArticlesAdminPanel", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-24T12:00:00Z"));
    pushMock.mockReset();
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the admin table and publishes a row with a default date", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        items: [
          {
            id: 16,
            title: "Draft article",
            slug: "draft-article",
            url: "/articles/draft-article",
            lang: "EN",
            reading_time: "4 min read",
            published_at: "",
            summary: "Draft summary",
            content: "# Draft content",
            img: "",
            featured: false,
            visible: false,
            status: "draft",
            saveState: "idle",
          },
        ],
      }),
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        item: {
          id: 16,
          title: "Draft article",
          slug: "draft-article",
          url: "/articles/draft-article",
          lang: "EN",
          reading_time: "4 min read",
          published_at: "2026-06-24",
          summary: "Draft summary",
          content: "# Draft content",
          img: "",
          featured: false,
          visible: true,
          status: "published",
          saveState: "idle",
        },
      }),
    });

    render(<ArticlesAdminPanel />);

    expect(await screen.findByText("Articles")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Actions" })
    ).toBeInTheDocument();
    expect(screen.getByText("Draft article")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "publish" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/content/articles/16",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });

    const publishCall = fetchMock.mock.calls[1];
    expect(publishCall[0]).toBe("/api/admin/content/articles/16");
    expect(JSON.parse(publishCall[1].body as string)).toMatchObject({
      status: "published",
      visible: true,
      published_at: "2026-06-24",
    });

    expect(await screen.findByText("Published")).toBeInTheDocument();
  });
});
