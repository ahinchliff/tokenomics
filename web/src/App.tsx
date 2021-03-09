import { useEffect, useRef, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import SocketClient from "./clients/socket-client";
import Api from "./clients/api-client";
import config from "./config";

let wsReconnectnterval: NodeJS.Timeout | undefined = undefined;

function App() {
  const api = useRef(
    new Api(config.apiEndpoint, (e) => {
      console.log(e);
      throw e.response ? e.response.data : e;
    })
  );

  const socketClient = useRef(
    new SocketClient(config.socketEndpoint, {
      onConnect: () => {
        setSocketStatus("connected");
        if (wsReconnectnterval) {
          clearInterval(wsReconnectnterval);
        }
      },
      onDisconnect: () => {
        if (!wsReconnectnterval) {
          wsReconnectnterval = setInterval(connectToSocketEndpoint, 5000);
        }
      },
      onError: () => {
        if (!wsReconnectnterval) {
          wsReconnectnterval = setInterval(connectToSocketEndpoint, 5000);
        }
      },
    })
  );

  const connectToSocketEndpoint = async () => {
    try {
      await socketClient.current.connect();
    } catch (e) {
      console.log(e);
    }
  };

  const [socketStatus, setSocketStatus] = useState<"connected" | "connecting">(
    "connecting"
  );

  const [recentInterestRevenue, setRecentInterestRevenue] = useState<
    api.MakerInterestRevenueStats["last20Drips"] | undefined
  >(undefined);

  const [recentTradeRevenue, setRecentTradeRevenue] = useState<
    api.PSMRevenueStats["last20Swaps"] | undefined
  >(undefined);

  const [interestRevenueStats, setInterestRevenueStats] = useState<
    api.MakerInterestRevenueStats | undefined
  >(undefined);

  const [psmRevenueStats, setPSMRevenueStats] = useState<
    api.PSMRevenueStats | undefined
  >(undefined);

  const fetchInterestRevenueStats = async () => {
    try {
      const result = await api.current.getInterestRevenueStats();
      setInterestRevenueStats(() => result);
      setRecentInterestRevenue(() => result.last20Drips);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPSMRevenueStats = async () => {
    try {
      const result = await api.current.getPSMRevenueStats();
      setPSMRevenueStats(() => result);
      setRecentTradeRevenue(() => result.last20Swaps);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(socketStatus);
  }, [socketStatus]);

  useEffect(() => {
    connectToSocketEndpoint();
    fetchInterestRevenueStats();
    fetchPSMRevenueStats();

    socketClient.current.addOnEvent(
      "MAKER_EVENT",
      (body: api.MakerSocketEvent) => {
        if (body.event === "interestRevenue") {
          setRecentInterestRevenue((recentInterestRevenue) =>
            recentInterestRevenue
              ? [body.data, ...recentInterestRevenue]
              : undefined
          );
        }

        if (body.event === "tradeRevenue") {
          setRecentTradeRevenue((recentTradeRevenue) =>
            recentTradeRevenue ? [body.data, ...recentTradeRevenue] : undefined
          );
        }
      }
    );

    return () => {
      if (wsReconnectnterval) {
        clearInterval(wsReconnectnterval);
      }
    };
  }, []);

  if (
    !interestRevenueStats ||
    !psmRevenueStats ||
    !recentInterestRevenue ||
    !recentTradeRevenue
  ) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <span className="text-4xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll bg-gray-100  ">
      <div className="grid grid-cols-1 gap-2 p-2 md:gap-6 md:p-6 xl:grid-cols-3">
        {/* <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white border-2 border-gray-200 rounded">
          <div className="flex justify-center">
            <div>
              <span>Dai Price</span>
              <span className="text-5xl font-semibold block">$1.004</span>
            </div>
          </div>
          <div className="flex justify-center">
            <div>
              <div className="flex justify-between">
                <span>Total Dai</span>
                <span className="text-green-500">33%</span>
              </div>
              <span className="text-5xl font-semibold block">2.57B</span>
            </div>
          </div>
          <div className="flex justify-center">
            <div>
              <div className="flex justify-between">
                <span>30d Rev</span>
                <span className="text-green-500">21%</span>
              </div>
              <span className="text-5xl font-semibold block">7.1M</span>
            </div>
          </div>
          <div className="flex justify-center">
            <div>
              <div className="flex justify-between">
                <span>MKR Price</span>
                <span className="text-green-500">10%</span>
              </div>
              <span className="text-5xl font-semibold block">$2,200</span>
            </div>
          </div>
        </div>
        <div
          className={`col-span-1 p-4 bg-white border-2 rounded border-gray-200 `}
        >
          <div className="grid grid-cols-2">
            <div className="flex justify-center">
              <div>
                <div className="flex justify-between">
                  <span>Surplus</span>
                </div>
                <span className="text-5xl font-semibold block">$20.5M</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div>
                <div className="flex justify-between">
                  <span>Next Buyback</span>
                </div>
                <span className="text-5xl font-semibold block">7 Days</span>
              </div>
            </div>
          </div>
        </div> */}
        <Tile1 title="💸 Recent interest revenue 💸">
          <RecentInterestRevenue lastDrips={recentInterestRevenue} />
        </Tile1>
        <Tile1 title="💸 Recent trade revenue 💸">
          <RecentTradeRevenue lastTrades={recentTradeRevenue} />
        </Tile1>
        <Tile1 title="💸 Recent liquidation pelenty revenue 💸">
          Coming Soon
        </Tile1>
        <Tile3 title="💰 Interest revenue by month 💰">
          <InterestRevenueByMonth
            interestRevenueByCollateralByMonth={
              interestRevenueStats.interestRevenueByCollateralByMonth
            }
          />
        </Tile3>
        <Tile2 title="🙏 Top interest revenue claimers 🙏">
          <TopRevenueCollectors
            top20RevenueCollectors={interestRevenueStats.topRevenueCollectors}
          />
        </Tile2>
        <Tile3 title="📈 Interest revenue by day 📈">
          <InterestRevenueByDay
            interestRevenueByDay={interestRevenueStats.interestRevenueByDay}
          />
        </Tile3>
      </div>
    </div>
  );
}

export default App;

// to clean up when get a chance
const Tile3: React.FC<{ title: string }> = (props) => {
  return (
    <div className={`bg-white border-2 rounded border-gray-200 lg:col-span-3`}>
      <div className="p-4 border-b-2 border-gray-200">
        <h2 className="text-lg font-semibold">{props.title}</h2>
      </div>
      <div className="p-4">{props.children}</div>
    </div>
  );
};

const Tile2: React.FC<{ title: string }> = (props) => {
  return (
    <div className={`bg-white border-2 rounded border-gray-200 lg:col-span-2`}>
      <div className="p-4 border-b-2 border-gray-200">
        <h2 className="text-lg font-semibold">{props.title}</h2>
      </div>
      <div className="p-4">{props.children}</div>
    </div>
  );
};

const Tile1: React.FC<{ title: string }> = (props) => {
  return (
    <div className={`bg-white border-2 rounded border-gray-200 lg:col-span-1`}>
      <div className="p-4 border-b-2 border-gray-200">
        <h2 className="text-lg font-semibold">{props.title}</h2>
      </div>
      <div className="p-4">{props.children}</div>
    </div>
  );
};

const RecentInterestRevenue: React.FC<{
  lastDrips: api.MakerInterestRevenueStats["last20Drips"];
}> = ({ lastDrips }) => {
  return (
    <div className="grid grid-cols-1 lg:gap-2 overflow-y-scroll">
      <div style={{ maxHeight: 450 }}>
        {lastDrips.map((d) => (
          <RevenueEvent event={d} key={d.id} />
        ))}
      </div>
    </div>
  );
};

const RevenueEvent: React.FC<{ event: api.MakerRevenueFromInterest }> = ({
  event,
}) => {
  const [timeAgo, setTimeAgo] = useState<string>(
    moment.utc(event.timestamp).fromNow()
  );

  useEffect(() => {
    let timer: NodeJS.Timeout = setInterval(() => {
      setTimeAgo(moment.utc(event.timestamp).fromNow());
    }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [event.timestamp]);

  return (
    <div className="grid grid-cols-3 py-2 border-b border-gray-200">
      <div>
        <span className="text-xs">{event.collateralType}</span>
      </div>
      <div className="text-right">
        <span className="text-xs">${Number(event.revenue).toFixed(2)}</span>
      </div>
      <div className="text-right">
        <span className="text-xs">{timeAgo}</span>
      </div>
    </div>
  );
};

const RecentTradeRevenue: React.FC<{
  lastTrades: api.PSMRevenueStats["last20Swaps"];
}> = ({ lastTrades }) => {
  return (
    <div className="grid grid-cols-1 lg:gap-2 overflow-y-scroll">
      <div style={{ maxHeight: 450 }}>
        {lastTrades.map((t) => (
          <div
            className="grid grid-cols-3 py-2 border-b border-gray-200"
            key={t.id}
          >
            <div>
              <span className="text-xs">{t.gem}</span>
            </div>
            <div className="text-right">
              <span className="text-xs">${Number(t.revenue).toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs">
                {moment.utc(t.timestamp).fromNow()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopRevenueCollectors: React.FC<{
  top20RevenueCollectors: api.MakerInterestRevenueStats["topRevenueCollectors"];
}> = ({ top20RevenueCollectors }) => {
  const data = top20RevenueCollectors
    .sort((a, b) => a.revenue - b.revenue)
    .map((top) => {
      return {
        address: top.address.substring(0, 10),
        revenue: top.revenue,
      };
    });

  return (
    <div style={{ height: 450 }}>
      <ResponsiveBar
        data={data}
        layout="horizontal"
        enableGridX={true}
        enableGridY={false}
        indexBy="address"
        keys={["revenue"]}
        margin={{ top: 10, bottom: 70, left: 80, right: 10 }}
        colors={{ scheme: "set2" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Revenue claimed (Dai)",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        enableLabel={false}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

const InterestRevenueByMonth: React.FC<{
  interestRevenueByCollateralByMonth: api.MakerInterestRevenueStats["interestRevenueByCollateralByMonth"];
}> = ({ interestRevenueByCollateralByMonth }) => {
  const keys: string[] = [];

  const data = interestRevenueByCollateralByMonth.map((i) => {
    const revenueByCollateralType = i.collaterals.reduce(
      (progress: { [key: string]: number }, next) => {
        if (!keys.find((k) => k === next.name)) {
          keys.push(next.name);
        }
        return {
          ...progress,
          [next.name]: next.revenue,
        };
      },
      {}
    );

    return {
      month: `${i.month}/${i.year}`,
      ...revenueByCollateralType,
    };
  });

  return (
    <div style={{ height: 450 }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="month"
        margin={{ top: 10, bottom: 30, left: 90 }}
        colors={{ scheme: "set2" }}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Revenue from interest (Dai)",
          legendPosition: "middle",
          legendOffset: -70,
        }}
        enableLabel={false}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

const InterestRevenueByDay: React.FC<{
  interestRevenueByDay: api.MakerInterestRevenueStats["interestRevenueByDay"];
}> = ({ interestRevenueByDay }) => {
  const data = interestRevenueByDay.map((d) => {
    return {
      x: moment.utc(d.date).format("DD/MM/YY"),
      y: d.revenue,
    };
  });

  return (
    <div style={{ height: 450 }}>
      <ResponsiveLine
        data={[
          {
            id: "",
            data,
          },
        ]}
        margin={{ top: 20, left: 50, bottom: 20 }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        colors={{ scheme: "set2" }}
        axisTop={null}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -40,
          legendPosition: "middle",
        }}
        axisBottom={null}
        enableGridX={false}
        enablePoints={false}
        enableArea={true}
        areaOpacity={1}
      />
    </div>
  );
};
