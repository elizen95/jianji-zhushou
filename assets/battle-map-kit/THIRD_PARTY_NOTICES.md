# 离线地图组件的第三方资源

本目录的 `runtime-vendor` 只包含下列版本的上游源码及各自 LICENSE；只将包名 import 改为本地相对路径，没有修改算法。上游版本及许可见下表和各本地依赖目录。

| 资源 | 固定版本 | 用途 | 许可与来源 |
|---|---|---|---|
| d3-geo | 3.1.1 | Mercator 投影、球面距离、路径与插值 | ISC；https://github.com/d3/d3-geo |
| d3-array | 3.2.4 | d3-geo 依赖 | ISC；https://github.com/d3/d3-array |
| internmap | 2.0.3 | d3-array 依赖 | ISC；https://github.com/mbostock/internmap |
| topojson-client | 3.1.0 | 构建时将 TopoJSON 转换为 GeoJSON，渲染不依赖它 | ISC；https://github.com/topojson/topojson-client |
| world-atlas | 2.0.2 | Natural Earth 110m / 50m 陆地海岸线 | ISC 包许可，地理数据公共领域；https://github.com/topojson/world-atlas |
| Natural Earth | world-atlas 2.0.2 所包含的数据快照 | 地理底图 | Public domain；https://www.naturalearthdata.com/about/terms-of-use/ |

`data/land-110m.geojson` 与 `land-50m.geojson` 由上述锁定版 `world-atlas` 的 land TopoJSON 生成，仅含陆地形状，没有现代国家行政边界。110m、50m 表示地图比例尺等级（1:110,000,000 / 1:50,000,000），不是地面精度米数。它们适合区域级概览，不适合证明古代海岸线或城镇级战术地形；海岸线会随年代变化。

地图示例中的行军路线、日期、纵队和控制区均为人工构造的教学数据，不代表任何实际战争。默认底图不带河流、高程、古代道路或历史疆界；需要这些元素时应另行取得适用年代和比例尺的数据，并登记出处与许可。

该组件不会访问地图瓦片服务，不需要 API key。将它嵌入现有 Remotion 工程时仍需该工程已有的 React、Remotion、浏览器和视频编码环境；这些不属于本地图组件的依赖打包范围。
