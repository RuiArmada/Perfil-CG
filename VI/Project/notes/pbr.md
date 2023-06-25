# Physically-based rendering

https://typhomnt.github.io/teaching/ray_tracing/pbr_intro/

Neste momento, o nosso _renderer_ não conserva energia. Uma superficie pode
refletir mais luz do que aquela que recebe, levando a _renders_ pouco realistas
e que frequentemente causam _overexposure_.

Podemos resolver este problema usando um modelo PBR.

## Micro-facet

No modelo PBR, cada superfície é simulada como sendo constituida de
micro-faces, cada uma apontando numa direção ligeiramente diferente. Quão mais
suave for a superfície, mais uniforme será a direção destas superfícies, sendo
completamente uniforme num espelho.

## Equação da luz

A luz num dado ponto $p$, visto da direção $v$ é dada pela equação

$$L_o(p, v) = \int_{A} f_r(p, l, v, \alpha_p) L_i(p, l)(n * l) dl$$

- $l$ -> Direção da luz incidente
- $\alpha_p$ -> _roughness_ da superfície no ponto $p$
- $L_i$ -> Radiância da luz incidente (cor RGB)
- $f_r$ -> função que controla a luz refletida no material
- $A$ -> hemisfério à volta de $p$

## Notas

`illum` define o modelo de iluminação a usar. Se for 3, é metálico, e o
parametro "Metallic" está representado no argumento Ka.

http://paulbourke.net/dataformats/mtl/
