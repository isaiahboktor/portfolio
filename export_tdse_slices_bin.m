function export_tdse_slices_bin(outFile, nFrames, stepsPerFrame, wellX, wellY, wellZ)
% Exports TDSE slices exactly like TDSE.m visualization, as float32 binary.
% Output layout (per frame):
%   Xslice (Nz x Ny), Yslice (Nz x Nx), Zslice (Ny x Nx),
%   ghostX (Nz x Ny), ghostY (Nz x Nx), ghostZ (Ny x Nx)
% All flattened in MATLAB column-major order via (:)

% --- Grid (matches your TDSE.m defaults) ---
Nx = 50; Ny = 50; Nz = 50;
Lx = 10; Ly = 10; Lz = 10;

x = linspace(-Lx/2, Lx/2, Nx);
y = linspace(-Ly/2, Ly/2, Ny);
z = linspace(-Lz/2, Lz/2, Nz);
[X,Y,Z] = ndgrid(x,y,z);

% --- Slice indices (matches TDSE.m) ---
sliceX = round(Nx/4);
sliceY = round(Ny/2);
sliceZ = round(Nz/2);

% --- Physics params (matches TDSE.m) ---
hbar = 1; m = 1; dt = 0.01;

% --- Init psi, V, absorbMask (copied from TDSE.m initializeSimulation) ---
[psi, V, absorbMask] = initializeSimulation(X,Y,Z,Nx,Ny,Nz, wellX,wellY,wellZ);

% --- Precompute k-space propagator (matches TDSE.m) ---
kx = (2*pi/Lx)*(-floor(Nx/2) : ceil(Nx/2)-1);
ky = (2*pi/Ly)*(-floor(Ny/2) : ceil(Ny/2)-1);
kz = (2*pi/Lz)*(-floor(Nz/2) : ceil(Nz/2)-1);
[Kx,Ky,Kz] = ndgrid(kx,ky,kz);
Tprop = exp(-1i * dt * (hbar * (Kx.^2 + Ky.^2 + Kz.^2) / (2*m)));

% --- Write binary ---
outDir = fileparts(outFile);
if ~isempty(outDir) && ~exist(outDir,'dir'), mkdir(outDir); end

fid = fopen(outFile, 'w');
assert(fid>0, "Could not open output file: %s", outFile);

% Data size sanity
valsPerFrame = 6 * 50 * 50; % all slices are 50x50 in your default setup

fprintf("Exporting %d frames to %s (%d float32 per frame)\n", nFrames, outFile, valsPerFrame);

for f = 1:nFrames
    for t = 1:stepsPerFrame
        % Potential half step
        psi = psi .* exp(-1i*V*dt/(2*hbar));

        % Kinetic step
        psi_k = fftn(psi);
        psi_k = fftshift(psi_k) .* Tprop;
        psi   = ifftn(ifftshift(psi_k));

        % Potential half step
        psi = psi .* exp(-1i*V*dt/(2*hbar));

        % Absorb
        psi = psi .* absorbMask;

        % Normalize
        psi = psi / sqrt(sum(abs(psi(:)).^2));
    end

    dens = abs(psi).^2;
    ghost = dens .* (X > 0);

    % Match your TDSE.m surf ZData shapes
    Xslice  = squeeze(dens(sliceX,:,:))';     % Nz x Ny
    Yslice  = squeeze(dens(:,sliceY,:))';     % Nz x Nx
    Zslice  = squeeze(dens(:,:,sliceZ))';     % Ny x Nx

    gXslice = squeeze(ghost(sliceX,:,:))';    % Nz x Ny
    gYslice = squeeze(ghost(:,sliceY,:))';    % Nz x Nx
    gZslice = squeeze(ghost(:,:,sliceZ))';    % Ny x Nx

    frameVec = single([Xslice(:); Yslice(:); Zslice(:); gXslice(:); gYslice(:); gZslice(:)]);
    fwrite(fid, frameVec, 'single');
end

fclose(fid);
fprintf("Done.\n");

end

function [psi, V, absorbMask] = initializeSimulation(X,Y,Z,Nx,Ny,Nz, wX,wY,wZ)
    x0 = -max(X(:))/4; y0 = 0; z0 = 0; sigma = 0.8;
    kx0 = 2; ky0 = 0; kz0 = 0;

    psi = exp(-((X-x0).^2 + (Y-y0).^2 + (Z-z0).^2)/(2*sigma^2)) ...
        .* exp(1i*(kx0*X + ky0*Y + kz0*Z));
    psi = psi / sqrt(sum(abs(psi(:)).^2));

    V0 = 5; wellDepth = 10;
    V = zeros(size(X));

    % barrier
    V((X >= 0) & (X <= wX)) = V0;

    % small well in corner
    xMax = max(X(:));
    yMin = min(Y(:));
    zMin = min(Z(:));
    V((X >= xMax-wX) & (X <= xMax) & ...
      (Y >= yMin) & (Y <= yMin+wY) & ...
      (Z >= zMin) & (Z <= zMin+wZ)) = -wellDepth;

    % absorb mask
    absorbWidth = 3; sigma_absorb = 0.05;
    absorbX = ones(Nx,1); absorbY = ones(Ny,1); absorbZ = ones(Nz,1);
    for i=1:absorbWidth
        coeff = exp(-((absorbWidth - i)/absorbWidth)^2 * sigma_absorb);
        absorbX(i) = coeff; absorbX(end-i+1) = coeff;
        absorbY(i) = coeff; absorbY(end-i+1) = coeff;
        absorbZ(i) = coeff; absorbZ(end-i+1) = coeff;
    end
    [AX,AY,AZ] = ndgrid(absorbX,absorbY,absorbZ);
    absorbMask = AX .* AY .* AZ;
end
