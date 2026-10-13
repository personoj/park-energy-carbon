import { Suspense, lazy, useEffect, useState } from 'react';
import type { DemoCampus } from '@park/contracts';

const CampusViewer = lazy(() =>
  import('@park/viewer-3d').then((module) => ({ default: module.CampusViewer })),
);

export function CampusPage() {
  const [campus, setCampus] = useState<DemoCampus | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/demo/campus', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`API 返回 ${response.status}`);
        return response.json() as Promise<DemoCampus>;
      })
      .then((data) => {
        setCampus(data);
        setSelectedId(data.assets[0]?.id ?? null);
      })
      .catch((reason: Error) => {
        if (reason.name !== 'AbortError')
          setError('演示接口暂不可用，请确认后端在 3001 端口运行。');
      });
    return () => controller.abort();
  }, []);
  const selected = campus?.assets.find((asset) => asset.id === selectedId);
  return (
    <main>
      <header>
        <div>
          <small>PARK ENERGY · COLLABORATIVE FOUNDATION</small>
          <h1>园区能源与碳管理</h1>
        </div>
        <span className="badge">开发骨架 · 合成演示数据</span>
      </header>
      <p className="intro">
        光伏、储能与厂房共享统一资产入口。选择场景方块或资产列表，查看联动详情。
      </p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {!campus && !error && <p role="status">正在连接演示接口…</p>}
      {campus && (
        <section className="workspace">
          <aside>
            <h2>园区资产</h2>
            {campus.assets.map((asset) => (
              <button
                key={asset.id}
                aria-pressed={selectedId === asset.id}
                onClick={() => setSelectedId(asset.id)}
              >
                <span className="dot" style={{ background: asset.color }} />
                {asset.name}
                <small>{asset.id}</small>
              </button>
            ))}
            <p className="muted">当前模型是程序生成的占位几何体，尚未接入真实园区模型。</p>
          </aside>
          <div className="scene" aria-label="园区三维占位场景">
            <Suspense fallback={<p>加载 3D 查看器…</p>}>
              <CampusViewer
                assets={campus.assets}
                selectedAssetId={selectedId}
                onSelectAsset={setSelectedId}
              />
            </Suspense>
          </div>
          <aside>
            <h2>{selected?.name ?? '请选择设备'}</h2>
            {selected && (
              <>
                <p className="muted">演示日：2026-01-01 · Asia/Shanghai</p>
                <div className="metric">
                  <small>{selected.energyLabel}</small>
                  <strong>
                    {selected.energyKwh.toLocaleString()} <em>kWh</em>
                  </strong>
                </div>
                <div className="metric">
                  <small>碳排放</small>
                  <strong className="pending">尚未核算</strong>
                  <p className="muted">需配置核算边界、方法和因子版本。</p>
                </div>
                <div className="metric">
                  <small>合成告警数量</small>
                  <strong>{selected.alarms}</strong>
                </div>
              </>
            )}
          </aside>
        </section>
      )}
      <footer>
        <strong>下一阶段</strong>
        <span>身份与数据权限</span>
        <span>数据导入批次</span>
        <span>核算草稿</span>
        <span>Agent 工具网关</span>
        <span>真实 3D 模型</span>
      </footer>
    </main>
  );
}
