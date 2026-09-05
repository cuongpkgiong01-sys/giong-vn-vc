import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClusterMap } from "@/components/map/cluster-map";
import { CLUSTERS, LOCATIONS, googleMapsPoint, type Location } from "@/lib/data/catalog";

export const Route = createFileRoute("/dia-diem")({ component: LocationsPage });

function LocationsPage() {
  const [selected, setSelected] = useState<Location | null>(null);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Mạng lưới</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">18 điểm giao nhận</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tọa độ dùng để đối chiếu GPS và kiểm tra trên Google Maps. Cập nhật 21/08/2026.
        </p>
      </div>

      <ClusterMap
        highlightIds={selected ? [selected.id] : []}
        onSelect={setSelected}
        className="min-h-72"
      />

      {selected ? (
        <Card>
          <CardContent className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{selected.name}</p>
              <p className="text-sm tabular-nums text-muted-foreground">
                {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
              </p>
            </div>
            <a
              href={googleMapsPoint(selected)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Mở Google Maps
              <ExternalLink className="size-4" />
            </a>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {CLUSTERS.map((c) => {
          const locs = LOCATIONS.filter((l) => l.cluster === c.id);
          return (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span>{c.name}</span>
                  <Badge variant="secondary">{locs.length} điểm</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
              </CardHeader>
              <CardContent className="px-0">
                <ul className="divide-y divide-border">
                  {locs.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(l)}
                        className="flex w-full items-start justify-between gap-3 px-5 py-3 text-left hover:bg-muted/40"
                      >
                        <span>
                          <span className="block text-sm font-medium">{l.name}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {l.lat.toFixed(5)}, {l.lng.toFixed(5)}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          {l.isHub ? <Badge>Hub</Badge> : null}
                          {l.noAllowance ? <Badge variant="muted">Không khoán</Badge> : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
